# Pokémon API Buscador

Una aplicación móvil moderna desarrollada con Angular e Ionic que permite a los usuarios explorar, buscar y gestionar su colección de Pokémon.

## 📱 Características

- 🔍 Búsqueda de Pokémon en tiempo real
- 📋 Lista paginada de Pokémon con scroll infinito
- 💾 Guardado de Pokémon favoritos
- 📊 Visualización detallada de estadísticas
- 💬 Sistema de comentarios para cada Pokémon
- 🎨 Interfaz de usuario moderna y responsiva
- 🌙 Soporte para modo oscuro

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Angular CLI
- Ionic CLI

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd Pokemon_API
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Añade las credenciales de Firebase necesarias

4. Inicia la aplicación en modo desarrollo:
```bash
ionic serve
```

## 📸 Capturas de Pantalla

![Sin título-1](https://github.com/user-attachments/assets/bfb9e4b1-0ca5-45a0-8f2a-6ef95d474c4f)
![Sin título](https://github.com/user-attachments/assets/c56aac44-6ece-4a33-9eb1-7239710c91c1)
![Sin título-1](https://github.com/user-attachments/assets/75ccd9b6-1bc1-4e1d-b90c-3eb69e83aced)
![Sin título](https://github.com/user-attachments/assets/063090ec-cb0a-42aa-bf76-b2f747771e6c)


## 🔧 Configuración de Firebase

1. Crea un proyecto en Firebase Console
2. Habilita Firestore Database
3. Configura las reglas de seguridad
4. Añade las credenciales en `src/environments/environment.ts`

## 📱 Construcción para Producción

Para Android:
```bash
ionic build
ionic cap add android
ionic cap sync android
ionic cap open android
```

## 👥 Autores

- Joseph Caza / Ariel Catucuamba 
