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

/**
 * Algoritmo de Punto Medio para trazar circunferencias píxel a píxel.
 * @param {number} xc - Centro en X
 * @param {number} yc - Centro en Y
 * @param {number} r - Radio
 */
function drawCircle(xc, yc, r, color = "#000000") {
    let x = 0;
    let y = r;
    
    // Lógica Matemática: Cálculo del parámetro de decisión inicial p.
    // p = 1 - r permite determinar si el siguiente píxel está 
    // dentro o fuera del borde ideal de la circunferencia. 
    let p = 1 - r;

    // Función interna para aplicar simetría de 8 octantes.
    // Esto optimiza el proceso dibujando 8 píxeles con un solo cálculo. 
    const plotCirclePoints = (xc, yc, x, y) => {
        drawPixel(ctx, xc + x, yc + y, color);
        drawPixel(ctx, xc - x, yc + y, color);
        drawPixel(ctx, xc + x, yc - y, color);
        drawPixel(ctx, xc - x, yc - y, color);
        drawPixel(ctx, xc + y, yc + x, color);
        drawPixel(ctx, xc - y, yc + x, color);
        drawPixel(ctx, xc + y, yc - x, color);
        drawPixel(ctx, xc - y, yc - x, color);
    };

    // Dibujamos los puntos iniciales
    plotCirclePoints(xc, yc, x, y);

    while (x < y) {
        x++;
        if (p < 0) {
            // El punto medio está dentro, solo incrementamos X
            p += 2 * x + 1;
        } else {
            // El punto medio está fuera, incrementamos X y decrementamos Y
            y--;
            p += 2 * (x - y) + 1;
        }
        plotCirclePoints(xc, yc, x, y);
    }
}

 /**
 * Calcula los vértices de un polígono regular.
 * @param {number} centerX - Centro en X
 * @param {number} centerY - Centro en Y
 * @param {number} sides - Número de lados
 * @param {number} radius - Radio
 * @returns {Array} Arreglo de objetos {x, y}
 */
function getPolygonVertices(centerX, centerY, sides, radius) {
    // Arreglo para almacenar las coordenadas de cada punto [cite: 37]
    let vertices = [];
    
    // Un círculo completo tiene 2 * PI radianes. Lo dividimos entre el número de lados.
    let angleStep = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
        // Lógica Matemática: Cálculo trigonométrico de las coordenadas.
        // Se multiplica el coseno/seno por el radio y se le suma el centro para desplazarlo.
        let x = centerX + radius * Math.cos(i * angleStep);
        let y = centerY + radius * Math.sin(i * angleStep);
        
        // Guardamos el vértice calculado en nuestro arreglo
        vertices.push({ x: x, y: y });
    }

    // Retorno de datos exigido en la rúbrica 
    return vertices;
}

/**
 * Función principal que orquesta el dibujo en el canvas.
 * Se ejecuta automáticamente al cargar el script.
 */
function drawScene() {
    // Configuración central del lienzo (nuestro canvas es de 800x600)
    const centerX = 400; 
    const centerY = 300; 
    const R = 150; // Radio del polígono (R)

    // Lógica para n aleatorio: un número entre 5 y 10
    // Math.random() genera un decimal entre 0 y 1. Lo ajustamos al rango deseado.
    const n = Math.floor(Math.random() * (10 - 5 + 1)) + 5; 

    // 1. Calculamos los vértices del polígono
    const vertices = getPolygonVertices(centerX, centerY, n, R);

    // 2. Dibujar las aristas del polígono (usando Bresenham)
    for (let i = 0; i < vertices.length; i++) {
        let actual = vertices[i];
        // Para cerrar el polígono, el último vértice debe conectarse con el primero (índice 0)
        let siguiente = vertices[(i + 1) % vertices.length];
        
        // Dibujamos la línea de un vértice al siguiente en color azul
        bresenhamLine(actual.x, actual.y, siguiente.x, siguiente.y, "#0000FF");
    }

    // 3. Dibujar las circunferencias en cada vértice (usando Punto Medio)
    // El radio de la circunferencia debe ser R/4 según las instrucciones
    const radioCirculo = R / 4;

    for (let i = 0; i < vertices.length; i++) {
        let vertice = vertices[i];
        // Dibujamos el círculo centrado en el vértice en color rojo
        drawCircle(vertice.x, vertice.y, radioCirculo, "#FF0000");
    }
}

// Llamamos a la función para que el proceso ocurra al cargar la página
drawScene();