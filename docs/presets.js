

import { demo, pane1, pane2, params } from './demo'
var $ = document.querySelector.bind(document)

function rand(a, b) { return a + (Math.random() * (b - a)) }
function rint(a, b) { return Math.floor(rand(a, b)) }
function rarr(arr) { return arr[rint(0, arr.length)] }
function rlog(a, b) { return Math.pow(2, rand(Math.log2(a), Math.log2(b))) }







/*
 * 
 *          SETUP AND ABSTRACTIONS
 * 
*/

var basePresets = []
setTimeout(() => {
    // do this after main module initializes
    basePresets = [pane1.exportPreset(), pane2.exportPreset()]
    delete basePresets[0].main_velocity
    delete basePresets[0].main_frequency
}, 1)



// expand folders needed for a given preset
function setFolders(args = []) {
    for (var s in params) {
        var exp = false
        if (s === 'main' || s === 'carrier') exp = true
        if (args.includes(s)) exp = true
        params[s].folder.expanded = exp
    }
}

// abstraction to init/apply/finish a preset
function applyPreset(applyPresetFn) {
    demo.beginEditingParams()
    // reset everything to defaults, before applying a preset
    pane1.importPreset(basePresets[0])
    pane2.importPreset(basePresets[1])
    var result = applyPresetFn()
    if (result.frequency) params.main.frequency = result.frequency
    setFolders(result.folders)
    demo.finishEditingParams()
}


// actual handlers
var addHandler = (name, fn) => {
    $('.' + name).addEventListener('click', ev => applyPreset(fn))
}

addHandler('reset', resetPreset)
addHandler('jump', jumpPreset)
addHandler('coin', coinPreset)
addHandler('expl', explosionPreset)
addHandler('laser', laserPreset)
addHandler('ouch', ouchPreset)
addHandler('power', powerPreset)
addHandler('ui', uiPreset)











/*
 * 
 *          PRESET IMPLEMENTATIONS
 * 
*/


function resetPreset() {
    var folders = []
    var frequency = 440
    return { folders, frequency }
}



function jumpPreset() {
    var folders = []
    var frequency = rlog(200, 800)
    params.carrier.type = rarr(['triangle', 'w909', 'w999'])
    params.carrier.duration = rand(0.05, 0.2)
    params.carrier.sustain = rand(0.2, 0.7)
    params.carrier.release = rand(0.05, 0.15)
    // sweeps and jumps and effects
    folders.push('sweep')
    params.sweep.multiplier = rand(1.1, 2.5)
    params.sweep.timeconst = rand(0.1, 0.3)
    if (rint(0, 2)) {
        folders.push('jump1')
        params.jump1.delay = rand(0.03, 0.1)
        params.jump1.multiplier = 1 + rand(0.1, 0.3) * rarr([1, -1])
    }
    return { folders, frequency }
}






function coinPreset() {
    var folders = []
    var frequency = rlog(120, 1600)
    params.carrier.type = rarr(['sine', 'triangle', 'w909', 'w999'])
    params.carrier.duration = rand(0.05, 0.1)
    params.carrier.sustain = rand(0.1, 0.5)
    params.carrier.release = rand(0.05, 0.25)
    // sweeps and jumps and effects
    if (rint(0, 4)) {
        folders.push('jump1')
        params.jump1.delay = rand(0.02, 0.1)
        params.jump1.multiplier = rand(1.1, 1.5)
        if (rint(0, 1.7)) {
            folders.push('jump2')
            params.jump2.delay = rand(0.02, 0.1)
            params.jump2.multiplier = rand(1.1, 1.5)
        }
    }
    return { folders, frequency }
}







function explosionPreset() {
    var folders = []
    var frequency = rlog(100, 1000)
    params.carrier.duration = rand(0.1, 0.2)
    params.carrier.sustain = rand(0.1, 0.5)
    params.carrier.release = rand(0.2, 0.3)
    if (rint(0, 2)) {
        params.carrier.type = rarr(['sine', 'triangle'])
        folders.push('FM')
        params.FM.type = rarr(['n0', 'np', 'nb'])
        params.FM.multiplier = rand(3, 10)
        params.FM.release = 5
        // sweeps and jumps and effects
        folders.push('sweep')
        params.sweep.multiplier = rand(0.2, 0.9)
        params.sweep.timeconst = params.carrier.release
    } else {
        params.carrier.type = rarr(['n0', 'np', 'nb'])
        folders.push('effect1')
        params.effect1.type = rarr(['bandpass', 'lowpass'])
        var low = /low/.test(params.effect1.type)
        params.effect1.freqmult = low ? rand(3, 8) : rand(1, 1.5)
        params.effect1.sweep = rand(0.1, 0.5)
        params.effect1.sweeptime = rlog(0.01, 0.2)
        params.effect1.q = rand(0.5, 5)
        if (rint(0, 2)) {
            folders.push('tremolo')
            params.tremolo.depth = rand(0.1, 0.5)
            params.tremolo.frequency = rlog(5, 60)
        }
    }
    if (rint(0, 2)) {
        folders.push('vibrato')
        params.vibrato.depth = rand(0.05, 0.2)
        params.vibrato.frequency = rlog(5, 60)
    }
    return { folders, frequency }
}



function laserPreset() {
    var folders = []
    var frequency = rlog(500, 2000)
    params.carrier.type = rarr(['sine', 'triangle', 'sawtooth', 'p10', 'p25', 'p40'])
    params.carrier.duration = rand(0.05, 0.15)
    params.carrier.sustain = rand(0.2, 0.6)
    params.carrier.release = rand(0.02, 0.1)
    // sweeps and jumps and effects
    folders.push('sweep')
    params.sweep.multiplier = rand(0.1, 0.85)
    params.sweep.timeconst = rand(0.02, 0.08)
    if (rint(0, 2)) {
        folders.push('vibrato')
        params.vibrato.depth = rand(0.1, 0.5)
        params.vibrato.frequency = rlog(5, 80)
    }
    return { folders, frequency }
}





function ouchPreset() {
    var folders = []
    var frequency = rlog(400, 1400)
    params.carrier.type = rarr(['square', 'sawtooth', 'p25', 'n0', 'np', 'nb'])
    params.carrier.duration = rlog(0.03, 0.06)
    params.carrier.sustain = rand(0.2, 0.6)
    params.carrier.release = rlog(0.01, 0.1)
    params.carrier.decay = rlog(0.01, 0.1)
    // sweeps and jumps and effects
    if (/^n/.test(params.carrier.type)) {
        folders.push('effect1')
        params.effect1.type = 'bandpass'
        params.effect1.freqmult = rand(1, 2)
        params.effect1.sweep = rand(0.1, 0.5)
        params.effect1.sweeptime = rlog(0.01, 0.05)
        params.effect1.q = rand(0.5, 5)
    } else {
        folders.push('sweep')
        params.sweep.multiplier = rand(0.25, 0.75)
        params.sweep.timeconst = rand(0.02, 0.08)
    }
    return { folders, frequency }
}







function powerPreset() {
    var folders = []
    var frequency = rlog(400, 1000)
    params.carrier.type = rarr(['sine', 'square', 'triangle', 'sawtooth', 'p25', 'w909'])
    params.carrier.duration = rand(0.05, 0.1)
    params.carrier.sustain = rand(0.2, 0.6)
    params.carrier.release = rand(0.05, 0.2)
    // sweeps and jumps and effects
    folders.push('sweep')
    params.sweep.multiplier = rand(1, 1.7)
    params.sweep.timeconst = rand(0.05, 0.2)
    folders.push('tremolo')
    params.tremolo.type = 'square'
    params.tremolo.depth = rlog(0.025, 0.5)
    params.tremolo.frequency = rlog(10, 50)
    return { folders, frequency }
}





function uiPreset() {
    var folders = []
    var frequency = rlog(150, 3000)
    params.carrier.type = rarr(['sine', 'square', 'triangle', 'sawtooth', 'p25', 'w909'])
    params.carrier.duration = rand(0.01, 0.05)
    params.carrier.attack = rand(0.01, 0.05)
    params.carrier.sustain = rand(0.2, 0.6)
    params.carrier.release = rand(0.01, 0.05)
    params.carrier.decay = rlog(0.01, 0.1)
    // sweeps and jumps and effects
    if (rint(0, 2)) {
        folders.push('sweep')
        params.sweep.multiplier = rand(0.5, 1.5)
        params.sweep.timeconst = rand(0.01, 0.5)
    }
    return { folders, frequency }
}







