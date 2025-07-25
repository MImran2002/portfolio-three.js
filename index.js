import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const canvas = document.querySelector("canvas.webgl")
let textGeometry, text, size, loaded=false;
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight}

const textureLoader = new THREE.TextureLoader();
const matCapPink = textureLoader.load('/static/image/7B5254_E9DCC7_B19986_C8AC91-256px.png',
    ()=>{console.log("Loading finished")},
    ()=>{console.log("Loading progressing")},
    ()=>{console.log("Loading error")}
);
matCapPink.colorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
camera.position.z = 1.5;
scene.add(camera);
const fontLoader = new FontLoader();
fontLoader.load('/static/font/helvetiker_regular.typeface.json',
    (font)=>{
        size = getSizeLoader();
        textGeometry = new TextGeometry(
            'Imran',
            {
                font: font,
                size: size,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        loaded = true
        const textMaterial = new THREE.MeshMatcapMaterial({matcap: matCapPink});
        textMaterial.wireframe = false;
        textGeometry.center();
        text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);
    }
)
const renderer = new THREE.WebGLRenderer({
    canvas : canvas
})
function getSizeLoader(){
    if (sizes.width >= 900){
        console.log("here")
        return 0.6;
    } else if (sizes.width >= 500){
        return 0.4;
    } else {
        return 0.2;
    }
}
window.addEventListener('resize', ()=>{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const scale = getSizeLoader();
    if (text) {
        text.scale.set(scale, scale, scale);
    }
}) 

const cursor = {
    x:0,
    y:0
}

window.addEventListener('mousemove', (event)=> {
    cursor.x = event.clientX/sizes.width - 0.5;
    cursor.y = event.clientY/sizes.height - 0.5;
})
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const tick = () => {
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(tick);
}

tick();
