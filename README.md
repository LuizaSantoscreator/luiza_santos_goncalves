# luiza_santos_goncalves
Projeto integrador do segundo semestre do curso de Desenvolvimento de Sistemas 

###Usuário: senai
###Senha: 123

1. O que precisa para rodar o Back-end (Django)
Este projeto usa Python e o framework Django.

A. Softwares para Instalar no Computador
Python 3.12+ (Linguagem de programação).

Onde baixar: Site oficial do Python.

Dica: Na instalação, marque a opção "Add Python to PATH".

VS Code (Editor de código).

Insomnia ou Postman (Opcional, mas recomendado para testar a API sem o Front-end).

B. Bibliotecas do Projeto (Instalar via terminal)
Dentro da pasta back do seu projeto, você precisa destas bibliotecas. Se você já tem o arquivo requirements.txt atualizado, basta rodar pip install -r requirements.txt.

Se for instalar manualmente, a lista completa é:

django: O framework principal.

djangorestframework: Para criar a API REST.

djangorestframework-simplejwt: Para autenticação segura (Login).

django-cors-headers: Para permitir que o Front-end converse com o Back-end.

django-filter: Para criar os filtros de busca (ex: ?tipo=Temperatura).

pandas: Para ler os arquivos CSV e popular o banco.

openpyxl: Para exportar os relatórios em Excel (.xlsx).

Comando único para instalar tudo:

Bash

pip install django djangorestframework djangorestframework-simplejwt django-cors-headers django-filter pandas openpyxl
2. O que precisa para rodar o Front-end (React)
Este projeto usa Node.js e a biblioteca React.

A. Softwares para Instalar no Computador
Node.js (Versão LTS).

Onde baixar: Site oficial do Node.js.

Por que: Ele é o motor que roda o servidor de desenvolvimento do Front-end e gerencia os pacotes (npm).

B. Bibliotecas do Projeto (Instalar via terminal)
Dentro da pasta front do seu projeto, estas são as bibliotecas que usamos no código:

react e react-dom: O coração do projeto (já vêm na instalação padrão do Vite).

react-router-dom: Para criar a navegação entre páginas (rotas).

axios: Para fazer as requisições HTTP ao Back-end (Login, buscar dados).

recharts: Para criar o gráfico de área na tela de histórico.

leaflet e react-leaflet: Para o mapa (embora tenhamos removido a rota, a biblioteca pode ter ficado instalada).

Comando para instalar as dependências extras:

Bash

npm install react-router-dom axios recharts

