# Documentación de la API de Recetario

Esta guía explica detalladamente cómo interactuar con los diferentes endpoints de la API.

## Base URL
`http://localhost:3000/api`

---

## 1. Autenticación

Todas las rutas marcadas como **Privada** requieren el header `Authorization: Bearer <TU_TOKEN>`.

### Registro de Usuario
**Endpoint:** `POST /auth/register`  
**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "mipasswordseguro",
  "username": "cocinillas99"
}
```

### Login
**Endpoint:** `POST /auth/login`  
**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "mipasswordseguro"
}
```
**Respuesta:** Retorna un `token` JWT que debes usar en las siguientes peticiones.

---

## 2. Recetas

### Ver todas las recetas (Público)
**Endpoint:** `GET /recipes`

### Ver una receta específica (Público)
**Endpoint:** `GET /recipes/:id`

### Crear una receta (Privada)
**Endpoint:** `POST /recipes`  
**Body (multipart/form-data):**
- `title`: "Nombre del plato"
- `description`: "Pasos a seguir..."
- `image`: (Archivo de imagen - opcional)

### Editar una receta (Privada - Solo el Dueño)
**Endpoint:** `PATCH /recipes/:id`  
**Body (multipart/form-data):**
- `title`: (Opcional)
- `description`: (Opcional)
- `image`: (Opcional)

### Eliminar una receta (Privada - Solo el Dueño)
**Endpoint:** `DELETE /recipes/:id`

---

## 3. Interacciones

### Agregar comentario (Privada)
**Endpoint:** `POST /recipes/:recipe_id/comments`  
**Body (JSON):**
```json
{
  "content": "¡Qué buena pinta tiene esto!"
}
```

### Alternar Favorito (Privada)
**Endpoint:** `POST /recipes/:recipe_id/favorite`  
**Nota:** Si la receta ya es favorita, la quita. Si no lo es, la agrega.

### Ver mis favoritos (Privada)
**Endpoint:** `GET /favorites`

---

## Ejemplo con cURL (Crear Receta)

```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Authorization: Bearer TU_JWT_AQUI" \
  -F "title=Pasta Carbonara" \
  -F "description=Receta tradicional italiana..." \
  -F "image=@/ruta/a/tu/foto.jpg"
```
