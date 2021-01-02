const printGLVersion = () => {
  const canvases = document.getElementsByTagName('canvas');
  const canvas = canvases[canvases.length - 1];
  const gl = canvas.getContext('webgl');

  console.log(`OpenGL version: ${gl.getParameter(gl.VERSION)}`);
  console.log(`GLSL version: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);
};

// https://threejsfundamentals.org/threejs/lessons/threejs-shadertoy.html
const Shader = {
  uniforms: {
    time: { value: 0.0 },
  },
  vertexShader: `
    void main() {
      // https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;

    void main() {
      vec3 color = vec3(0.5 * cos(time) + 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

export {
  Shader,
  printGLVersion,
};
