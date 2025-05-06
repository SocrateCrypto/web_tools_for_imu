// quaternion_function.js

/**
 * Поворачивает объект в сцене на основе заданного кватерниона.
 * @param {object} object - Объект, который нужно повернуть.
 * @param {number} w - Компонент w кватерниона.
 * @param {number} x - Компонент x кватерниона.
 * @param {number} y - Компонент y кватерниона.
 * @param {number} z - Компонент z кватерниона.
 */
function rotateObjectWithQuaternion(object, w, x, y, z) {
    // Создаем кватернион из заданных компонентов
    const quaternion = new THREE.Quaternion(x, y, z, w);

    // Применяем кватернион к вращению объекта
    object.quaternion.copy(quaternion);
}

// Пример использования:
// Предположим, у вас есть сцена THREE.js и объект для вращения
// const object = new THREE.Mesh(geometry, material);
// rotateObjectWithQuaternion(object, 1, 0, 0, 0);

/**
 * Как использовать функцию rotateObjectWithQuaternion:
 * 
 * 1. Импортируйте функцию:
 *    import { rotateObjectWithQuaternion } from './quaternion_function.js';
 * 
 * 2. Создайте объект THREE.js:
 *    const geometry = new THREE.BoxGeometry(1, 1, 1);
 *    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
 *    const object = new THREE.Mesh(geometry, material);
 *    scene.add(object);
 * 
 * 3. Вызовите функцию с объектом и компонентами кватерниона:
 *    const w = 1;
 *    const x = 0;
 *    const y = 0;
 *    const z = 0;
 *    rotateObjectWithQuaternion(object, w, x, y, z);
 * 
 * Пример:
 * import * as THREE from 'three';
 * import { rotateObjectWithQuaternion } from './quaternion_function.js';
 * 
 * // Создание сцены, камеры и рендера
 * const scene = new THREE.Scene();
 * const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 * camera.position.z = 5;
 * const renderer = new THREE.WebGLRenderer();
 * renderer.setSize(window.innerWidth, window.innerHeight);
 * document.body.appendChild(renderer.domElement);
 * 
 * // Создание объекта
 * const geometry = new THREE.BoxGeometry(1, 1, 1);
 * const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
 * const object = new THREE.Mesh(geometry, material);
 * scene.add(object);
 * 
 * // Вращение объекта
 * const w = 1;
 * const x = 0;
 * const y = 0;
 * const z = 0;
 * rotateObjectWithQuaternion(object, w, x, y, z);
 * 
 * // Цикл анимации
 * function animate() {
 *     requestAnimationFrame(animate);
 *     renderer.render(scene, camera);
 * }
 * animate();
 */

export { rotateObjectWithQuaternion };