# # Utiliser une image Node.js officielle
# FROM node:18

# # Définir le répertoire de travail dans le conteneur
# WORKDIR /api

# # Copier les fichiers package.json et package-lock.json
# COPY package*.json ./

# # Installer les dépendances
# RUN npm install

# # Copier le reste des fichiers de l'application
# COPY . .

# # Ajouter l'option pour la connexion au host
# ENV HOST_DOCKER_INTERNAL=host.docker.internal

# # Exposer le port sur lequel ton API tourne
# EXPOSE 8800

# # Lancer l'application
# CMD ["node", "index.js"]