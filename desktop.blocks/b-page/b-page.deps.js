({
    mustDeps : [
        { block : 'i-bem', elems : ['dom', 'html', 'tree'] }
    ],
    shouldDeps : [
        { mods : { theme : 'white' } },
        { mods : { page : 'error' } },
        { block : 'static-text' },
        { block : 'b-text' },
        { block : 'headline' },
        { block : 'link' },
        { block : 'olist' },
        { block : 'ulist' },
        { block : 'para' },
        { block : 'island' },
        { block : 'header' },
        { block : 'layout', mods : { type : 'serp' } },
        { block : 'layout', mods : { section : '100' } },
        { block : 'content' },
        { block : 'footer' }
    ]
})
