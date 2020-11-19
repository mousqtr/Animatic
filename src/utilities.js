// Drawing Mesh
export const drawMesh = (predictions, ctx) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const keypoints = prediction.scaledMesh;
            var pointsX = [];
            var pointsY = [];
            var pointsZ = [];
           
            for (let i = 0; i < keypoints.length; i++) {

                // console.log(keypoints[i])

                const x = keypoints[i][0];
                const y = keypoints[i][1];
                const z = keypoints[i][2];

                // ctx.font = '10px serif';
                // if ((i == 10) || (i == 127) || (i == 152) || (i == 356)){
                //     var nbx = Math.floor(x);
                //     var nby = Math.floor(y);
                //     var nbz = Math.floor(z);

                //     pointsX.push(nbx);
                //     pointsY.push(nby);
                //     pointsZ.push(nbz);
                    
                //     ctx.fillText(i, x, y);
                //     ctx.beginPath();
                //     ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
                //     ctx.fillStyle = "aqua";
                //     ctx.fill();
                // }
                ctx.beginPath();
                ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
                ctx.fillStyle = "aqua";
                ctx.fill();
  
            }

            var X1 = pointsX[4] - pointsX[3];
            var X2 = pointsX[3] - pointsX[1];
            // var Y = pointsY[] - pointsY[];
            console.log(X1, X2)


        });
    }
};