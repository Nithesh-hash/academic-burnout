# -*- mode: python ; coding: utf-8 -*-
import os
import sys

block_cipher = None

project_dir = os.path.abspath(SPECPATH)
frontend_dist = os.path.join(project_dir, 'frontend', 'dist')
ml_model_file = os.path.join(project_dir, 'ml_model', 'isolation_forest.joblib')
backend_dir = os.path.join(project_dir, 'backend')

datas = [
    (frontend_dist, 'frontend_dist'),
    (os.path.join(project_dir, 'ml_model'), 'ml_model'),
    (os.path.join(backend_dir, 'app'), 'backend/app'),
]

hiddenimports = [
    'uvicorn',
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.http.h11_impl',
    'uvicorn.protocols.http.httptools_impl',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.protocols.websockets.websockets_impl',
    'uvicorn.protocols.websockets.wsproto_impl',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'fastapi',
    'fastapi.staticfiles',
    'fastapi.responses',
    'starlette',
    'starlette.middleware',
    'starlette.middleware.cors',
    'starlette.staticfiles',
    'pydantic',
    'pydantic_core',
    'sklearn',
    'sklearn.ensemble',
    'sklearn.ensemble._iforest',
    'sklearn.tree',
    'sklearn.neighbors',
    'joblib',
    'numpy',
    'pandas',
    'shap',
    'motor',
    'pymongo',
    'passlib',
    'passlib.handlers.bcrypt',
    'bcrypt',
    'jwt',
    'app',
    'app.main',
    'app.config',
    'app.database',
    'app.auth',
    'app.models',
    'app.routers.auth',
    'app.routers.behaviour',
    'app.routers.risk',
    'app.ml.risk_engine',
]

a = Analysis(
    ['desktop_app.py'],
    pathex=[project_dir, backend_dir],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'torch',
        'torchvision',
        'ultralytics',
        'cv2',
        'opencv_python',
        'PIL',
        'matplotlib',
        'seaborn',
        'tkinter',
        'IPython',
        'pytest',
        'pygments',
        'sympy',
        'numba',
        'llvmlite',
        'polars',
        'alembic',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='AcademicBurnoutAI',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
