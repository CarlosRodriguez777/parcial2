/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Carlos Andres Rodriguez Diaz 
 * Tarea: Implementar los algoritmos de rasterización manual.
 */

// Configuración inicial del Contexto 2D
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(10, 10, 50, 50);

function drawPixel(ctx, x, y, color = "#000000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

drawPixel(ctx, 100, 100, "blue");