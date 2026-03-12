# 🍳 Recetario API

API REST para gestionar recetas de cocina, usuarios e interacciones como comentarios y favoritos.
Permite crear, consultar, editar y eliminar recetas, así como interactuar con ellas mediante comentarios y favoritos.

---

## 🚀 Características

* 🔐 Autenticación con **JWT**
* 👤 Registro y login de usuarios
* 🍲 CRUD completo de **recetas**
* 💬 Sistema de **comentarios**
* ⭐ Sistema de **favoritos**
* 🖼️ Subida de imágenes para recetas
* 🔒 Protección de rutas privadas

---

# 🌐 Base URL

```
https://recetario-api-olive.vercel.app/api
```

---

# 🔐 Autenticación

Las rutas marcadas como **Privadas** requieren el siguiente header:

```
Authorization: Bearer TU_TOKEN
```

El token se obtiene al iniciar sesión.

---

# 👤 Usuarios

## Registro

**Endpoint**

```
POST /auth/register
```

**Body**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "mipasswordseguro",
  "username": "cocinillas99"
}
```

---

## Login

**Endpoint**

```
POST /auth/login
```

**Body**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "mipasswordseguro"
}
```

**Respuesta**

```json
{
  "token": "JWT_TOKEN_AQUI"
}
```

Este token debe enviarse en las rutas privadas.

---

# 🍲 Recetas

## Obtener todas las recetas

**Público**

```
GET /recipes
```

---

## Obtener una receta por ID

**Público**

```
GET /recipes/:id
```

---

## Crear receta

**Privado**

```
POST /recipes
```

**Body (multipart/form-data)**

| Campo       | Tipo   | Descripción                    |
| ----------- | ------ | ------------------------------ |
| title       | string | Nombre del plato               |
| description | string | Pasos o instrucciones          |
| image       | file   | Imagen de la receta (opcional) |

---

## Editar receta

**Privado – Solo el dueño**

```
PATCH /recipes/:id
```

**Body (multipart/form-data)**

| Campo       | Opcional |
| ----------- | -------- |
| title       | ✔        |
| description | ✔        |
| image       | ✔        |

---

## Eliminar receta

**Privado – Solo el dueño**

```
DELETE /recipes/:id
```

---

# 💬 Interacciones

## Agregar comentario

**Privado**

```
POST /recipes/:recipe_id/comments
```

**Body**

```json
{
  "content": "¡Qué buena pinta tiene esto!"
}
```

---

## Alternar favorito

**Privado**

```
POST /recipes/:recipe_id/favorite
```

**Comportamiento**

* Si la receta **ya está en favoritos → la elimina**
* Si **no está → la agrega**

---

## Ver mis favoritos

**Privado**

```
GET /favorites
```

---

# 📦 Ejemplo con cURL

Crear una receta con imagen:

```bash
curl -X POST https://recetario-api-olive.vercel.app/api/recipes \
  -H "Authorization: Bearer TU_JWT_AQUI" \
  -F "title=Pasta Carbonara" \
  -F "description=Receta tradicional italiana..." \
  -F "image=@/ruta/a/tu/foto.jpg"
```

---

# 🛠️ Tecnologías utilizadas

* Node.js
* Express
* JWT
* Multer (upload de imágenes)
* Vercel (deployment)

---

# 📄 Licencia

Este proyecto es de uso educativo y libre para aprendizaje.

---

# 👨‍💻 Autor

Desarrollado por **NekoCoder**
