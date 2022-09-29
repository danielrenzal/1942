document.addEventListener("DOMContentLoaded", () => {

    /** image elements */
    const heroIcon = document.getElementById("hero");

    const enemy1Icon = document.createElement("div");
    enemy1Icon.classList.add("enemy1");

    const enemy2Icon = document.createElement("div");
    enemy2Icon.classList.add("enemy2");

    const bulletIcon = document.createElement("div");
    bulletIcon.classList.add("bullet");

    
    /** container element */
    const enemiesContainer = document.querySelector(".enemies");
    const bulletsContainer = document.querySelector(".bullets");

    const gameOverSign = document.querySelector(".game_over");

    const scoreDisplay = document.querySelector(".score");
    let scoreValue = 0;

    /** sounds */
    const shootSound = document.querySelector(".shoot");
    const explodeSound = document.querySelector(".explode");
    const collisionSound = document.querySelector(".collide");


    /** class to generate the hero, enemies and bullets
     *  x & y: positions
     *  icon: their html element
     *  interval: to save their setInterval ID for when it needs to be cleared
     */
    class Element{
        constructor(x, y, icon, interval = null){
            this.x = x;
            this.y = y;
            this.icon = icon;
            this.interval = interval
        }

        /** method to position the element in the DOM */
        positionElement(){
            this.icon.style.top = this.y + "px";
            this.icon.style.left = this.x + "px";
        }
    }

    /** create the hero and position it */
    const hero = new Element(160, 400, heroIcon);
    hero.positionElement();

    addEventListener("keydown", event => {
        switch(event.code){
            case "ArrowUp":
                if(hero.y > 10) hero.y -= 10;
                break;
            case "ArrowRight":
                if(hero.x < 320) hero.x += 10;
                break;
            case "ArrowDown":
                if(hero.y < 420) hero.y += 10;
                break;
            case "ArrowLeft":
                if(hero.x > 10) hero.x -= 10;
                break;
            case "Space":
                /** play sound effect */
                const new_shot = shootSound.cloneNode();
                new_shot.play();

                /** generate bullet then append to the DOM */
                const bullet = new Element(hero.x+7, hero.y-7, bulletIcon.cloneNode());
                bullet.positionElement();
                bulletsContainer.appendChild(bullet.icon);

                /** move the bullet upwards */
                bullet.interval = setInterval(() => {
                    bullet.y -= 3;
                    bullet.positionElement();

                    /** remove from the DOM if it reached the top */
                    if(bullet.y <= 0){
                        clearInterval(bullet.interval);
                        bullet.icon.remove();
                    }

                    /** if it collides with an enemy... */
                    enemies.forEach((enemy, index) => {
                        if(Math.abs(bullet.x - enemy.x) < 20 && Math.abs(bullet.y - enemy.y) < 10){
                            /** play sound effect */
                            const new_explode = explodeSound.cloneNode();
                            new_explode.play();
                            /** stop moving the bullet then remove from the DOM */
                            clearInterval(bullet.interval);
                            bullet.icon.remove();
                            /** change the image of the enemy from airplane to exploding (using class) */
                            enemy.icon.classList.remove("enemy");
                            enemy.icon.classList.add("explode");
                            /** push backwards slightly */
                            enemy.y -= 10;

                            /** after awhile, return the enemy to original state to appear like it's
                             * a new enemy coming
                             */
                            setTimeout(() => {
                                enemy.icon.classList.add("enemy");
                                enemy.icon.classList.remove("explode");
                                enemy.y = 0;
                            }, 100);

                            /** increase the score then display */
                            scoreValue += 10;
                            scoreDisplay.textContent = scoreValue;
                        }
                    });

                }, 5);
                break;
        }

        /** every keydown, position the hero element */
        hero.positionElement();
    });


    const enemies = [
        new Element(10, 0, enemy1Icon.cloneNode()),
        new Element(200, 100, enemy2Icon.cloneNode()),
        new Element(120, 80, enemy1Icon.cloneNode()),
        new Element(300, 120, enemy1Icon.cloneNode()),
        new Element(320, 20, enemy2Icon.cloneNode()),
        new Element(180, 130, enemy1Icon.cloneNode()),
        new Element(70, 90, enemy2Icon.cloneNode()),
    ];

    enemies.forEach(enemy => {
        enemiesContainer.appendChild(enemy.icon);   
        
        enemy.interval = setInterval(() => {
            enemy.y += 2;
            enemy.positionElement();
    
            /** if enemy reached the bottom part of the view/background/canvas,
             * place it again to the top to a different x coordinate to look like
             * it's a new enemy coming
             */
            if(enemy.y == 424){
                enemy.y = 0;
                enemy.x = Math.random() * 310;
            }
    
            /** if the enemy collides with the hero */
            if(Math.abs(enemy.x - hero.x) <= 20 && Math.abs(enemy.y - hero.y) <= 0){
                /** play sound effect */
                const new_collision = collisionSound.cloneNode();
                new_collision.play();
                /** decrease score then display */
                scoreValue -= 500;
                scoreDisplay.textContent = scoreValue;
    
                /** if the score reached zero, show the game over sign then stop the 
                 * enemies from moving using the clearInterval method
                 */
                if(scoreValue <= 0){
                    scoreDisplay.textContent = 0;
                    gameOverSign.style.display = "block";
                    enemies.forEach(enemy => clearInterval(enemy.interval));
                }
            }
        }, 10);
    })
});