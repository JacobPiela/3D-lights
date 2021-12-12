const apiVersion = "v1"

exports.init = function(app,EM){
    app.get('/api/' + apiVersion + '/seteffect', (req, res) => {
        EM.setEffect(req.query.name)
        res.send("OK")
    })

    app.get('/api/' + apiVersion + '/clear', (req, res) => {
        EM.clear()
        res.send("OK")
    })

    app.get('/api/' + apiVersion + '/listeffects', (req, res) => {
        res.send(JSON.stringify(EM.effects))
    })

    app.get('/api/' + apiVersion + '/getConfig', (req, res) => {
        res.send(JSON.stringify(EM.config))
    })

    app.get('/api/' + apiVersion + '/custom', (req, res) => {
        try{
            let pixels  = JSON.parse(decodeURI(eq.query.pixels))
            EM.args = JSON.parse(decodeURI(eq.query.args))
            res.send("OK")
        } catch(err){
            EM.setEffect("error")
            res.send("error")
        }
    })

    app.get('/api/' + apiVersion + '/setargs', (req, res) => {
        try{
            EM.args = JSON.parse(decodeURI(eq.query.args))
            res.send("OK")
        } catch(err){
            EM.setEffect("error")
            res.send("error")
        }
    })

    app.get('/api/' + apiVersion + '/scanled', (req, res) => {
        try{
            let pixels  = new Uint32Array(EM.config.leds)
            pixels[parseInt(req.query.id)] = 0xFF0000
            EM.custom(pixels)
            res.send("OK")
        } catch(err){
            EM.setEffect("error")
            res.send("error")
        }
    })

    app.get('/api/' + apiVersion + '/setcolor', (req, res) => {
        try{
            let color = (parseInt(req.query.color.substr(1), 16) << 8) / 256;
            let pixels  = new Uint32Array(EM.config.leds)
            for (var i = 0; i < this.pixels.length; i++){
                this.pixels[i] = 0x000000
            }
            EM.custom(pixels)
            res.send("OK")
        } catch(err){
            EM.setEffect("error")
            res.send("error")
        }
    })
}