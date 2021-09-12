import './main.scss'

import * as THREE from 'three' // https://threejs.org/docs/
import { BloomEffect, EffectComposer, ShaderPass, EffectPass, RenderPass } from "postprocessing" // https://threejs.org/docs/?q=pro#manual/en/introduction/How-to-use-post-processing
import { TweenLite, TweenMax, gsap } from 'gsap' // https://greensock.com/docs/
import howlerjs from 'howler' // https://github.com/goldfire/howler.js#documentation

import Scene from '../static/js/Scene' // Création de la scène + renderer + camera
import LoadModel from '../static/js/LoadModel' // Chargement d'un modèle 3D
import Mouse from '../static/js/Mouse' // Obtenir la position de la souris dans tous les environnement
import Blueprint from '../static/js/Blueprint' // Template de plane
import Raycaster from '../static/js/Raycaster' // Création de raycasters si besoin
import Control from '../static/js/Control' // Orbitcontrol (pour le debbugage)
import Settings from '../static/js/Settings.js' // Dat.gui (toujours pour le debbugage)

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile
} else {
    // Desktop
}


const scene = new Scene({
    canvas: document.querySelector('.webgl'),
})

const blueprint = new Blueprint({
    scene: scene,
})

const mouse = new Mouse({
    scene: scene
})

const control = new Control({
    camera: scene.camera,
    renderer: scene.renderer
})

const settings = new Settings()

document.addEventListener('keydown', e => {
    console.log(`${e.key} touch pressed`)
})

function raf() {
    const deltaTime = scene.clock.getDelta()
    const elapsedTime = scene.clock.getElapsedTime()
    const lowestElapsedTime = elapsedTime / 11

    scene.renderer.render(scene.scene, scene.camera)
    
    // Update controls
    control.controls.update()
    window.requestAnimationFrame(raf)
}

raf()