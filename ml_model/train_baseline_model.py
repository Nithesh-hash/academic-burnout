import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib
import os

def generate_training_data(n_samples=500):
    """Generates synthetic baseline student behavior dataset."""
    np.random.seed(42)
    
    # Normal patterns (85% of data)
    n_normal = int(n_samples * 0.85)
    sleep_normal = np.random.normal(loc=7.5, scale=0.8, size=n_normal)
    study_normal = np.random.normal(loc=4.0, scale=1.0, size=n_normal)
    screen_normal = np.random.normal(loc=3.5, scale=1.0, size=n_normal)
    delay_normal = np.random.poisson(lam=0.3, size=n_normal)
    attendance_normal = np.random.normal(loc=92.0, scale=4.0, size=n_normal)
    workload_normal = np.random.choice([1, 2, 3, 4], size=n_normal, p=[0.1, 0.4, 0.4, 0.1])
    
    # Anomalous/High-risk patterns (15% of data)
    n_anomaly = n_samples - n_normal
    sleep_anomaly = np.random.uniform(3.0, 5.0, size=n_anomaly)
    study_anomaly = np.random.uniform(0.5, 2.0, size=n_anomaly)
    screen_anomaly = np.random.uniform(7.0, 11.0, size=n_anomaly)
    delay_anomaly = np.random.randint(3, 8, size=n_anomaly)
    attendance_anomaly = np.random.uniform(50.0, 75.0, size=n_anomaly)
    workload_anomaly = np.random.choice([4, 5], size=n_anomaly, p=[0.3, 0.7])
    
    # Combine
    sleep = np.clip(np.concatenate([sleep_normal, sleep_anomaly]), 1, 14)
    study = np.clip(np.concatenate([study_normal, study_anomaly]), 0, 12)
    screen = np.clip(np.concatenate([screen_normal, screen_anomaly]), 0, 16)
    delay = np.clip(np.concatenate([delay_normal, delay_anomaly]), 0, 10)
    attendance = np.clip(np.concatenate([attendance_normal, attendance_anomaly]), 0, 100)
    workload = np.concatenate([workload_normal, workload_anomaly])
    
    df = pd.DataFrame({
        'sleep_hours': sleep,
        'study_hours': study,
        'screen_time': screen,
        'assignment_delay': delay,
        'attendance': attendance,
        'workload': workload
    })
    return df

def train_and_save():
    print("Generating synthetic student behavior dataset...")
    df = generate_training_data(1000)
    
    feature_cols = ['sleep_hours', 'study_hours', 'screen_time', 'assignment_delay', 'attendance', 'workload']
    X = df[feature_cols]
    
    print("Fitting Isolation Forest Model...")
    clf = IsolationForest(contamination=0.15, random_state=42, n_estimators=100)
    clf.fit(X)
    
    model_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(model_dir, "isolation_forest.joblib")
    joblib.dump(clf, output_path)
    print(f"Model successfully saved to {output_path}")

if __name__ == "__main__":
    train_and_save()
