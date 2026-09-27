#!/bin/sh
# Corre el laboratorio (lab/) dentro de Docker (python:3.13-bookworm); en el servidor no se instala nada.
#   ./lab.sh uv sync                          instala el entorno desde uv.lock
#   ./lab.sh python -m system_one prepare     cualquier programa del entorno (.venv/bin/...)
# Monta lab/ en /lab y web/ en /web. Los modelos se guardan en una caché fuera del repositorio.
cd "$(dirname "$0")"
CACHE_MODELOS="${CACHE_MODELOS:-/var/lib/dooservice/.cache/huggingface}"
TERMINAL=""; [ -t 0 ] && TERMINAL="-it"
BASE="docker run --rm $TERMINAL -u $(id -u):$(id -g) -e HOME=/tmp -e PYTHONUNBUFFERED=1 -v $PWD:/lab -w /lab"
if [ "$1" = "uv" ]; then
  shift
  exec $BASE -e UV_CACHE_DIR=/tmp/uv python:3.13-bookworm sh -c "pip install -q --user uv && ~/.local/bin/uv $*"
fi
exec $BASE -e HF_HOME=/modelos -v "$CACHE_MODELOS":/modelos -v "$PWD/../web":/web \
  python:3.13-bookworm /lab/.venv/bin/"$@"
