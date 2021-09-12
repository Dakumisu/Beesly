import './main.scss'

import * as THREE from 'three'
import { BloomEffect, EffectComposer, ShaderPass, EffectPass, RenderPass } from "postprocessing"
import { TweenLite, TweenMax, gsap } from 'gsap'
import howlerjs from 'howler'

import Scene from '../static/js/Scene'
import LoadModel from '../static/js/LoadModel'
import Mouse from '../static/js/Mouse'
import Blueprint from '../static/js/Blueprint'
import Raycaster from '../static/js/Raycaster'
import Control from '../static/js/Control'
import Settings from '../static/js/Settings.js'

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile
} else {
    // Desktop
}

// const music = new Howl({
//     src: ['/sound/music.mp3'],
//     autoplay: false,
//     loop: true, 
//     stereo: 0,
//     volume: .7,
// })

// --------------------------------------- Init THREE.js features ---------------------------------------
// Scene
const scene = new Scene({
    canvas: document.querySelector('.webgl'),
})

const blueprint = new Blueprint({
    scene: scene.scene,
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


let lowestElapsedTime = 0

function raf() {
    const deltaTime = scene.clock.getDelta()
    const elapsedTime = scene.clock.getElapsedTime()
    lowestElapsedTime += 0.0006

    scene.renderer.render(scene.scene, scene.camera)
    
    // Update controls
    control.controls.update()
    window.requestAnimationFrame(raf)
}

raf()