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
background 

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