(function(global){
    if(!global.THREE) {
        console.warn('PathControler need three.js.');
    } else {
        THREE = global.THREE;
        const PLAYMODES = {
            ONETIME: 0,
            REPEAT: 1,
            REPEATFOREVER: 2,
            ONETIMEANDHOLDEND: 3,
        }
        let i;
        let time;
        let position1, position2;
        let rotation1, rotation2;
        function PathControler(camera, pathInfo, mode, repeattime) {
            this.camera = camera;
            this.positions = pathInfo.positions;
            this.rotations = pathInfo.rotations;
            this.times = pathInfo.times;
            this.maxtime = this.times[this.times.length - 1];
            this.mintime = this.times[0];
            this.startTime = 0;
            this.currentTime = 0;
            this.currentNode = 0;
            this.mode = mode || PLAYMODES.ONETIME;
            this.repeattime = repeattime || 1;
            this.finishedLoop = 0;
        }

        THREE.PathControler = PathControler;

        Object.assign(PathControler.prototype, {

            start(time) {
                this.startTime = time;
                this.currentTime = 0;
                this.finishedLoop = 0;
                this.currentNode = 0;
            },

            update(time) {
                this.currentTime = time - this.startTime;
                this.currentTime *= 0.001;
                if(this.currentTime > this.mintime && this.currentTime < this.maxtime) {
                    for(i = 0; i < this.times.length; i ++) {
                        if (this.times[i] > this.currentTime) {
                            time = this.currentTime - this.times[i - 1];
                            time = time / (this.times[i] - this.times[i - 1]);
                            position1 = this.positions[i - 1];
                            position2 = this.positions[i];
                            rotation1 = this.rotations[i - 1];
                            rotation2 = this.rotations[i];
                            position1 = new THREE.Vector3(...position1);
                            position2 = new THREE.Vector3(...position2);
                            rotation1 = new THREE.Euler(...rotation1);
                            rotation2 = new THREE.Euler(...rotation2);
                            rotation1 = new THREE.Quaternion().setFromEuler(rotation1);
                            rotation2 = new THREE.Quaternion().setFromEuler(rotation2);
                            position1 = position1.lerp(position2, time);
                            rotation1 = rotation1.slerp(rotation2, time);
                            rotation1 = new THREE.Euler().setFromQuaternion(rotation1);

                            this.camera.position.copy(position1);
                            this.camera.rotation.copy(rotation1);
                            return;
                        }
                    }
                }

            }
        })
    
    }
})(this);
