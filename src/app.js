import './main.scss'

import { TweenLite, TweenMax, gsap } from 'gsap' // https://greensock.com/docs/
import howlerjs from 'howler' // https://github.com/goldfire/howler.js#documentation

import World from '@src/js/World' // Création de la scène + renderer + camera
import LoadModel from '@js/LoadModel' // Chargement d'un modèle 3D
import Mouse from '@js/Mouse' // Obtenir la position de la souris dans tous les environnement
import Blueprint from '@js/Blueprint' // Template de plane
import Raycaster from '@js/Raycaster' // Création de raycasters si besoin
import Control from '@js/Control' // Orbitcontrol (pour le debbugage)
import Settings from '@js/Settings' // Dat.gui (toujours pour le debbugage)
import Device from '@js/Device'
import Raf from '@js/Raf'

const blueprint = new Blueprint()

document.addEventListener('keydown', e => {
    console.log(`${e.key} touch pressed`)
})

Raf.suscribe('update', () => { update() })

function update() {
    World.render()
    Control.update()
}