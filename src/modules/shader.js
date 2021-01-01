const printGLVersion = () => {
  const canvases = document.getElementsByTagName('canvas');
  const canvas = canvases[canvases.length - 1];
  const gl = canvas.getContext('webgl');

  console.log(`OpenGL version: ${gl.getParameter(gl.VERSION)}`);
  console.log(`GLSL version: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);
};

const Shader = {
  uniforms: {},
  vertexShader: `
    void main() {
      // https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    }
  `,
};

export {
  Shader,
  printGLVersion,
};
