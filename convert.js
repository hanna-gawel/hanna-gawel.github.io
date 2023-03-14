const fs = require('fs')
const yaml = require('js-yaml')

let li_regex = /^[0-9]+./gm
let date_regex = /\(([0-9]*)\)/
// get file name from argument
// read the file and replace li_regex matches with <li>
let fileName = process.argv[2]
let fileContent = fs.readFileSync(fileName, 'utf8')

let newContent = fileContent.replace(li_regex, '<li>')
let wrapped = newContent.split('\n').map((s) => s.length > 1 ? s : '')

function compare_entry(a, b) {
    // log the entry

    if (a.length > 0 && b.length > 0) {
        ayear = a.match(date_regex)[1]
        byear = b.match(date_regex)[1]
        return parseInt(byear) - parseInt(ayear)
    } else if (a.length > 0) {
        return 1
    } else if (b.length > 0) {
        return -1
    }
    return 0
}

// sort lines of file by date
wrapped = wrapped.sort(compare_entry)

// now read info about papers
let fileContents = fs.readFileSync('./bib/data.yml', 'utf8')
let data = yaml.load(fileContents)
for (const k in data) {
    entry = data[k]
    for (const i in wrapped) {
        line = wrapped[i]
        let v = entry.key.reduce((a, e) => line.toLowerCase().includes(String(e).toLowerCase()) && a, true)
        if (v) {
            // make new dom
            let dom = '<div class="paper-info">'
            for (const j in entry) {
                if (j != 'key') {
                    dom += `<a href="${entry[j]}">${j}</a> | `
                }
            }
            wrapped[i] += dom.slice(0, -2) + '</div>'
        }
    }
}


console.log(wrapped.join('\n'))