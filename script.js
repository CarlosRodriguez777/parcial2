/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Carlos Andres Rodriguez Diaz 
 * Tarea: Implementar los algoritmos de rasterización manual.
 */

// Configuración inicial del Contexto 2D
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawPixel(ctx, x, y, color = "#000000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

// =========================================================
// PASO 2: drawPixel + Bresenham
// =========================================================

/**
 * Función de apoyo para dibujar un píxel individual.
 * Basada en el ejemplo del parcial.
 */
function drawPixel(ctx, x, y, color = "#000000") {
    ctx.fillStyle = color;
    // Se usa Math.floor para asegurar que el trazo sea píxel a píxel 
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

/**
 * Implementación del algoritmo de Bresenham para líneas.
 * @param {number} x0, y0 - Coordenadas iniciales
 * @param {number} x1, y1 - Coordenadas finales
 */
function bresenhamLine(x0, y0, x1, y1, color = "#000000") {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    
    // Determinamos la dirección del movimiento (sx, sy)
    // Esto permite soportar pendientes m > 1 y m < 0 (todos los octantes) 
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    
    // Lógica matemática: Cálculo del parámetro de decisión inicial p
    // En este algoritmo se representa como 'err' para ajustar el error acumulado 
    let err = dx - dy;

    while (true) {
        drawPixel(ctx, x0, y0, color);

        // Si llegamos al punto final, terminamos el ciclo
        if (x0 === x1 && y0 === y1) break;

        // Ajuste del error: se decide si avanzar en X, en Y o en ambos ejes
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy; // Ajuste del error en el eje X
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx; // Ajuste del error en el eje Y
            y0 += sy;
        }
    }
}
bresenhamLine(50, 50, 200, 200, "blue");