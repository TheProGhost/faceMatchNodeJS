const faceapi = require('face-api.js');
const fs = require('fs');
const MODEL_URL = './models';
const { Canvas, Image, loadImage } = require('canvas'); 
// const path = require('path');
const imgSize = require('image-size');

//  configure face-api.js
faceapi.env.monkeyPatch({Canvas, Image, fetch : fetch.bind(global)});

let run = async (callback) => {
    try{
        let image1;
        fs.readdirSync('./single').forEach(file => {
            image1 = fs.readFileSync(`./single/${file}`);
        })
         
        // let dimention1 = imgSize(image1);
        image1 = await loadImage(image1);
        
        // loading models
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    
        const detections1 = await faceapi.detectAllFaces(image1).withFaceLandmarks().withFaceDescriptors();
        const discriptors1 = detections1[0].descriptor;
        if(detections1.length === 0){
            console.log('no face in image');
        }

        let files = fs.readdirSync('./public');
        for(let file of files) {
            console.log(file);
            let image2 = fs.readFileSync(`./public/${file}`);
            let image_2 = await loadImage(image2);
            console.log("file read done");

            const detections2 = await faceapi.detectAllFaces(image_2).withFaceLandmarks().withFaceDescriptors();
            const discriptors2 = detections2[0].descriptor;

            if(detections2.length === 0){
                console.log('no face in images');
            }
            else{
                const distance = await faceapi.euclideanDistance(discriptors1, discriptors2);
                console.log(distance);
                if(distance < 0.7){
                    console.log("Faces are matching");
                    fs.writeFileSync(`./matchedImages/${file}`, image2);
                }
                else{
                    console.log("face not match");
                }
            }
        };
        callback(null);
    }
    
    catch(err){
        console.log(err);
        callback(err)
        // return;
    }    
};

module.exports = run;