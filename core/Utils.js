const _ = require("underscore");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const logger = require('tracer').console({});

function resizeBase64 (base64Image, width = 100, height = 100) {
    
    return new Promise( (resolve, reject) => {

        const check = _.isString(base64Image) && base64Image.length>0 
        if(!check) reject() 

        let parts = base64Image.split(';');
        let mimType = parts[0].split(':')[1];
        let imageData = parts[1].split(',')[1];

        var img = new Buffer.from(imageData, 'base64');

        sharp(img)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        // .max() // to keep scale :) 
        .toBuffer()
        .then(resizedImageBuffer => {
            let resizedImageData = resizedImageBuffer.toString('base64');
            let resizedBase64 = `data:${mimType};base64,${resizedImageData}`;
            resolve(resizedBase64)
        })
        .catch(error => {
            reject(error)
        })
        
    })
}

module.exports = {

    resizePictureBase64OfInstance : (instance, options, arg = "picture") => {
        // var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        var base64regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/


        return new Promise((resolve, reject) => {
            const pic = instance[arg]
            const test = base64regex.test(pic)
            logger.log(pic, "is base 64 of", arg, test)
            if (pic && typeof pic === "string" && pic.length > 0 && test) {
                logger.log("try to resize")
                resizeBase64(pic, 10, 10).then((resized) => {
                    logger.log(resized)
                    instance[arg] = resized
                    resolve()
                }).catch(e => {
                    reject(e)
                })

            } else {
                delete instance[arg]
                resolve()
            }
        })
    },

    getMostRecentFileName : (dir, type = null) => {
        var files = fs.readdirSync(dir);
        if(type) {
            files = files.filter(x => x.endsWith(type))
        }

        logger.log(files)
        // use underscore for max()
        return _.max(files, function (f) {
            var fullpath = path.join(dir, f);

            // ctime = creation time is used
            // replace with mtime for modification time
            return fs.statSync(fullpath).ctime;
        });
    },

    capitalize : (string) => {
      return string && string.charAt(0).toUpperCase() + string.slice(1)
    },

    sanitizeName : (chaine) => {

        var tab1=" 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ-"  
        var tab2="__aaaaaaaaaaaaooooooooooooeeeeeeeecciiiiiiiiuuuuuuuuynn_"
        var rep1 = tab1.split('')
        var rep2 = tab2.split('')
        var myarray=[]
        _.each(rep1, (rep, i) => {
            myarray[rep] = rep2[i]
        })
        myarray['Œ']='OE'
        myarray['œ']='oe'

        chaine = chaine.replace(/\//g, '_').replace(/\\/g, '_')
         
        return chaine.replace(/./g, function($0){return (myarray[$0])?myarray[$0]:$0 })
    },

    getMatches : (string, regex, index) => {
      index || (index = 1); // default to the first capturing group
      var matches = [];
      var match;
      while (match = regex.exec(string)) {
        matches.push(match[index]);
      }
      return matches;
    },

    getRandomInt : (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomFloat : (min, max, float=2) => {
        return (Math.random() * (max - min + 1) + min).toFixed(float);
    },

    sanitizeHtml : (html) => {
        return html.replace(/<[\s\S]*?>/gi, "")
    },

    resizeBase64 : resizeBase64

}