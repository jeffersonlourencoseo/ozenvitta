@echo off
chcp 65001 >nul
cls
echo ============================================
echo  GERADOR DE SITE — Blog Review de Produto
echo ============================================
echo.
echo Este script cria automaticamente um novo site
echo a partir do template de nutraceuticos.
echo.
echo INSTRUCOES:
echo 1. Crie um arquivo .json com os dados do produto
echo    (baseado no produto-template.json)
echo 2. Salve o arquivo .json na MESMA pasta deste script
echo 3. Digite o nome do arquivo abaixo (ex: meu-produto.json)
echo.
echo ============================================
echo.

set /p JSON_FILE="Nome do arquivo JSON: "

if "%JSON_FILE%"=="" (
    echo.
    echo ERRO: Voce nao digitou nenhum nome.
    echo Exemplo correto: meu-produto.json
    pause
    exit /b 1
)

if not exist "%JSON_FILE%" (
    echo.
    echo ERRO: Arquivo "%JSON_FILE%" nao encontrado.
    echo.
    echo Certifique-se de que:
    echo  - O arquivo .json esta na MESMA pasta deste .bat
    echo  - Voce digitou o nome correto (com .json no final)
    echo.
    echo Arquivos JSON encontrados nesta pasta:
    dir /b *.json 2>nul
    if errorlevel 1 echo   (nenhum arquivo .json encontrado)
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Iniciando geracao do site...
echo  Arquivo: %JSON_FILE%
echo ============================================
echo.

node create-new-site.js "%JSON_FILE%"

if errorlevel 1 (
    echo.
    echo ============================================
    echo  ERRO durante a geracao do site.
    echo ============================================
    echo.
    echo Possiveis causas:
    echo  - Node.js nao esta instalado
    echo  - A pasta "nutraceutico-site" nao esta na mesma pasta
    echo  - O arquivo JSON esta com erro de formato
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  GERACAO CONCLUIDA!
echo ============================================
echo.
echo Proximos passos:
echo  1. Abra a pasta gerada acima
echo  2. Preencha o arquivo KW-*.txt com palavras-chave
echo  3. Coloque imagens em public/images/
echo  4. Abra terminal e digite: npm install
echo  5. Depois: npm run build
echo  6. Deploy no Vercel
echo.
pause
