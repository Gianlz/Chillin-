// WebGL Shader Background
const canvas = document.getElementById('bg');
const gl = canvas.getContext('webgl');
const vsSource = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const fsSource = `precision mediump float;uniform float t;uniform vec2 r;
void main(){vec2 u=(gl_FragCoord.xy-.5*r.xy)/r.y;float l=length(u);
float a=atan(u.y,u.x);float d=l-sin(a*8.+t)*.02;float c=.01/abs(d-.4+sin(a*3.-t)*.05);
gl_FragColor=vec4(vec3(c*.35),1.);}`;

const shader = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
}
const program = gl.createProgram();
gl.attachShader(program, shader(gl.VERTEX_SHADER, vsSource));
gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fsSource));
gl.linkProgram(program);
gl.useProgram(program);

const pLoc = gl.getAttribLocation(program, 'p');
gl.enableVertexAttribArray(pLoc);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);

const start = Date.now();
const render = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(gl.getUniformLocation(program, 't'), (Date.now() - start) * .001);
    gl.uniform2f(gl.getUniformLocation(program, 'r'), canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
};
render();

// Carousel Logic
let c = 1, t, x, k = document.getElementById('carouselTrack');
const g = n => {
    c = (n + 3) % 3;[...k.children].forEach((e, i) => e.className = 'carousel-slide ' +
        (['active', 'next', 'prev'][(i - c + 3) % 3] || 'hidden')); clearInterval(t); t = setInterval(() => g(c + 1), 3000)
};

[['headphones_green.png', 'G'], ['woman_headphones.png', 'W'], ['cable_beige.png', 'C']].forEach((d, i) =>
    k.innerHTML += `<div class="carousel-slide" onclick="c!=${i}&&g(${i})"><img src="images/${d[0]}" alt="${d[1]}"></div>`);

onload = () => { g(1); document.querySelector('button').onclick = e => e.target.animate([{ transform: 'scale(.95)' }, {}], 150) };
onkeydown = e => e.key.startsWith('Arr') && g(c + (e.key == 'ArrowRight' ? 1 : -1));
k.ontouchstart = e => x = e.changedTouches[0].screenX;
k.ontouchend = e => Math.abs(e.changedTouches[0].screenX - x) > 50 && g(c + (x > e.changedTouches[0].screenX ? 1 : -1));
k.onmouseenter = () => clearInterval(t); k.onmouseleave = () => g(c);
