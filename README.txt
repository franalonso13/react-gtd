Intalación del proyecto en ubuntu, en concreto se ha seguido esta guía de instalación
en la versión ubuntu 18.04.3 LTS .

Para el proyecto necesitamos tener instalado node y npm.

Para evitar problemas, se explicará el procedimiento para instalar 
la versión concreta de node que se ha instalado para el desarrollo del proyecto. En concreto
la versión de node es la 12.16.0 y de npm la versión que viene
asociada con esa versión de node, la 6.13.4 .

Pasos para levantar el proyecto en nuestro local: 

1. Nos aseguramos que los repositorios de ubuntu están actualizados. Ejecutamos el comando: 

sudo apt update


3. Nos aseguramos de que tenemos isntalado curl para después instalar nvm. Ejecutamos el comando: 

sudo apt install curl


2. Instalamos nvm para poder instalar una versión concreta de node. Para ello ejecutamos el siguiente comando:
 
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash


3. Instalamos la versión concreta de node para el proyecto con nvm. Al instalar node, también se nos instala el gestor
de paquete npm. Ejecutamos el siguiente comando:

nvm install 12.16.0


4. Activamos la versión de node que vamos a usar ejecutando el comando: 

nvm use 12.16.0


5. Comprobamos que tenemos instalado node y npm, comprobando las versiones con los comandos: 
--> node -v
--> npm -v


6. Instalamos todas las dependencias del proyecto colocándonos en el directorio raíz donde se encuentra el archivo package.json y ejecutamos el siguiente comando:

npm install

7. Levantamos el servidor en local. Ejecutamos desde el directorio raíz del proyecto el comando:

npm run start

8. Nos aparecerá por consola que accedamos a http://localhost:3000 en el navegador.




