import asyncio
import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
from app.config import MONGODB_URL, DATABASE_NAME

# Try PyMongo / Motor
try:
    from motor.motor_asyncio import AsyncIOMotorClient
    HAS_MOTOR = True
except ImportError:
    HAS_MOTOR = False

class FallbackCollection:
    """In-memory & JSON file fallback collection if MongoDB daemon is offline."""
    def __init__(self, name: str, data_dir: str):
        self.name = name
        self.file_path = os.path.join(data_dir, f"{name}.json")
        self.docs: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, "r", encoding="utf-8") as f:
                    self.docs = json.load(f)
            except Exception:
                self.docs = []
        else:
            self.docs = []

    def _save(self):
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        with open(self.file_path, "w", encoding="utf-8") as f:
            json.dump(self.docs, f, indent=2)

    async def insert_one(self, doc: Dict[str, Any]):
        doc_to_save = dict(doc)
        if "_id" not in doc_to_save:
            doc_to_save["_id"] = str(uuid.uuid4())
        if "id" not in doc_to_save:
            doc_to_save["id"] = doc_to_save["_id"]
        self.docs.append(doc_to_save)
        self._save()
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc_to_save["_id"])

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        import re
        for d in self.docs:
            match = True
            for k, v in query.items():
                target_val = d.get(k)
                if isinstance(v, dict) and "$regex" in v:
                    pattern = v["$regex"]
                    flags = re.IGNORECASE if v.get("$options") == "i" else 0
                    if not (isinstance(target_val, str) and re.search(pattern, target_val, flags)):
                        match = False
                        break
                elif target_val != v:
                    match = False
                    break
            if match:
                return dict(d)
        return None

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                if "$set" in update:
                    for sk, sv in update["$set"].items():
                        d[sk] = sv
                else:
                    for sk, sv in update.items():
                        d[sk] = sv
                self._save()
                break

    def find(self, query: Dict[str, Any]):
        results = []
        for d in self.docs:
            match = True
            for k, v in query.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                results.append(dict(d))
        
        class Cursor:
            def __init__(self, items):
                self.items = items
            def sort(self, key_or_list, direction=1):
                if isinstance(key_or_list, list):
                    key = key_or_list[0][0]
                    rev = key_or_list[0][1] < 0
                else:
                    key = key_or_list
                    rev = direction < 0
                self.items = sorted(self.items, key=lambda x: x.get(key, ""), reverse=rev)
                return self
            def limit(self, n):
                self.items = self.items[:n]
                return self
            async def to_list(self, length=None):
                if length is not None:
                    return self.items[:length]
                return self.items
        
        return Cursor(results)

class DatabaseManager:
    def __init__(self):
        self.is_mongo = False
        self.db = None
        self.client = None
        self.fallback_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", "data"
        )
        self.fallback_collections: Dict[str, FallbackCollection] = {}

    async def connect(self):
        """Attempts connection to MongoDB with timeout; falls back to JSON DB if unavailable."""
        if HAS_MOTOR:
            try:
                self.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
                # Quick ping test
                await self.client.admin.command('ping')
                self.db = self.client[DATABASE_NAME]
                self.is_mongo = True
                print(f"Connected to MongoDB at {MONGODB_URL} (Database: {DATABASE_NAME})")
                return
            except Exception as e:
                print(f"MongoDB connection notice ({e}). Activating JSON collection fallback engine.")

        # Setup Fallback engine
        self.is_mongo = False
        os.makedirs(self.fallback_dir, exist_ok=True)
        for col in ["Users", "StudentProfiles", "BehaviourRecords", "RiskPredictions"]:
            self.fallback_collections[col] = FallbackCollection(col, self.fallback_dir)
        print(f"Database operational using local collection engine at {self.fallback_dir}")

    def get_collection(self, name: str):
        if self.is_mongo:
            return self.db[name]
        return self.fallback_collections.get(name, FallbackCollection(name, self.fallback_dir))

# Global database manager instance
db_manager = DatabaseManager()
