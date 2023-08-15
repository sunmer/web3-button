import React, { useRef, useEffect } from 'react';

const SpaceEarn: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const rocketImage = new Image();
  rocketImage.src = 'public/invader.svg';
  const rocketImageJump = new Image();
  rocketImageJump.src = 'public/invader-jump.svg';

  const rocketSpeed = 0;
  const gameSpeed = 2.3;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const rocket = {
      x: canvas.width / 4,
      y: canvas.height / 2,
      width: 40,
      height: 40,
      speedY: 0,
      gravity: 0.6,
      jump: -8,
    };

    const pipes: { x: number; topHeight: number; bottomY: number }[] = [];
    const pipeWidth = 50;
    const pipeGap = 150;
    const pipeSpacing = 50;
    let score = 0;

    const stars: { x: number; y: number; radius: number; speed: number }[] = [];

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
      });
    }

    function drawStars() {
      if (!canvas || !ctx) return;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      stars.forEach((star) => {
        star.x -= star.speed * gameSpeed;

        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    }

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawStars();

      const isRocketGoingUp = rocket.speedY < 0;

      if (isRocketGoingUp) {
        ctx.drawImage(rocketImageJump, rocket.x, rocket.y, rocket.width, rocket.height);
      } else {
        ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
      }

      ctx.fillStyle = '#00f';
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
      });

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function update() {
      if (!canvas) return;

      rocket.speedY += rocket.gravity;
      rocket.y += rocket.speedY;

      rocket.x += rocketSpeed * gameSpeed;

      if (rocket.y > canvas.height - rocket.height) {
        rocket.y = canvas.height - rocket.height;
        rocket.speedY = 0;
      }

      pipes.forEach((pipe) => {
        pipe.x -= 2 * gameSpeed;

        if (pipe.x + pipeWidth < 0) {
          pipes.shift();
          score++;
        }

        if (
          rocket.x + rocket.width > pipe.x &&
          rocket.x < pipe.x + pipeWidth &&
          (rocket.y < pipe.topHeight || rocket.y + rocket.height > pipe.bottomY)
        ) {
          resetGame();
        }
      });

      if (rocket.y <= 0) {
        resetGame();
      }

      if (frames % pipeSpacing === 0) {
        const topHeight = Math.random() * (canvas.height - pipeGap);
        pipes.push({
          x: canvas.width,
          topHeight,
          bottomY: topHeight + pipeGap,
        });
      }

      draw();
      frames++;
      requestAnimationFrame(update);
    }

    let frames = 0;

    document.addEventListener('keydown', () => {
      rocket.speedY = rocket.jump;
    });

    function resetGame() {
      if (!canvas) return;

      rocket.y = canvas.height / 2;
      rocket.speedY = 0;
      pipes.length = 0;
      score = 0;
      frames = 0;
    }

    update();

    return () => {
      document.removeEventListener('keydown', () => {
        rocket.speedY = rocket.jump;
      });
    };
  }, []);

  return (
    <div className="card w-96 p-0 bg-base-100 shadow-xl text-left">
      <canvas className="rounded-2xl" ref={canvasRef} />
    </div>
  );
};

export default SpaceEarn;
