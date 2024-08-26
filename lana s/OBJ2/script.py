import pandas as pd
# from sklearn.linear_model import LinearRegression
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import numpy as np
from sklearn.metrics import mean_squared_error, r2_score,  accuracy_score, classification_report
from sklearn.model_selection import train_test_split
import seaborn as sns
import matplotlib.pyplot as plt

x = pd.read_csv("independiente.csv")
y = pd.read_csv("dependiente.csv")

datos = pd.merge(x, y, on = ['city','year','weekofyear'], how = 'inner')

columns_x = ['year','weekofyear','ndvi_ne','ndvi_nw','ndvi_se','ndvi_sw','precipitation_amt_mm','reanalysis_air_temp_k','station_avg_temp_c','reanalysis_relative_humidity_percent','station_precip_mm']
columns_y = ['total_cases']

x = datos[columns_x]
y = datos[columns_y]

X_train, X_test, y_train, y_test = train_test_split(x, y, test_size = 0.3, random_state = 42)

imputer = SimpleImputer(strategy = 'mean')
X_train_imputed = imputer.fit_transform(X_train)
X_test_imputed = imputer.transform(X_test)

rf = RandomForestRegressor(n_estimators = 100, random_state = 42)
rf.fit(X_train_imputed, y_train)

y_pred = rf.predict(X_test_imputed)

# Probar modelo

nuevo_caso = pd.DataFrame({
    'year': [2024],  # Año del nuevo caso
    'weekofyear': [7],  # Semana del año del nuevo caso
    'ndvi_ne': [0.02],  # NDVI noreste
    'ndvi_nw': [0.025],  # NDVI noroeste
    'ndvi_se': [0.123],  # NDVI sureste
    'ndvi_sw': [0.12],  # NDVI suroeste
    'precipitation_amt_mm': [23.9],  # Precipitación en mm
    'reanalysis_air_temp_k': [295],  # Temperatura del aire en Kelvin
    'station_avg_temp_c': [25],  # Temperatura promedio en °C
    'reanalysis_relative_humidity_percent': [792.0],  # Humedad relativa en porcentaje
    'station_precip_mm': [9.2]  # Precipitación medida en la estación en mm
})

nuevo_caso = nuevo_caso.reindex(columns=X_train.columns, fill_value=0)

prediccion = rf.predict(nuevo_caso)

print(f'Predicción para el nuevo caso: {prediccion[0]:.2f} casos de dengue')

# Exportar modelo

import joblib

joblib.dump(rf, 'model.pkl')