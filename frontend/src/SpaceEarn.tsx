import React, { useRef, useEffect } from 'react';

const SpaceEarn: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const bird = {
      x: canvas.width / 4,
      y: canvas.height / 2,
      width: 40,
      height: 30,
      speedY: 0,
      gravity: 0.5,
      jump: -10,
    };

    const pipes: { x: number; topHeight: number; bottomY: number; }[] = [];
    const pipeWidth = 50;
    const pipeGap = 150;
    const pipeSpacing = 200;
    let score = 0;

    const stars: { x: number; y: number; radius: number; speed: number; }[] = [];

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1, // Add speed to stars
      });
    }

    function drawStars() {
      if (!canvas || !ctx)
        return

      // Fill the canvas with a dark background color
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fff';
      stars.forEach(star => {
        star.x -= star.speed; // Move stars to the left

        if (star.x < 0) {
          star.x = canvas.width; // Reset stars that go off the left edge
          star.y = Math.random() * canvas.height; // Reset y position
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    }

    function draw() {
      if (!ctx || !canvas)
        return

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawStars();

      // Draw bird
      ctx.fillStyle = '#f00';
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

      // Draw pipes
      ctx.fillStyle = '#00f';
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
      });

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function update() {
      if (!canvas)
        return

      bird.speedY += bird.gravity;
      bird.y += bird.speedY;

      if (bird.y > canvas.height - bird.height) {
        bird.y = canvas.height - bird.height;
        bird.speedY = 0;
      }

      pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipeWidth < 0) {
          pipes.shift();
          score++;
        }

        if (
          bird.x + bird.width > pipe.x &&
          bird.x < pipe.x + pipeWidth &&
          (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
        ) {
          resetGame();
        }
      });

      if (bird.y <= 0) {
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
      bird.speedY = bird.jump;
    });

    function resetGame() {
      if (!canvas)
        return

      bird.y = canvas.height / 2;
      bird.speedY = 0;
      pipes.length = 0;
      score = 0;
      frames = 0;
    }

    update();

    return () => {
      document.removeEventListener('keydown', () => {
        bird.speedY = bird.jump;
      });
    };
  }, []);

  return (
    <div className="card w-96 bg-base-100 shadow-xl text-left">
      <h2 className="card-title">Space game</h2>
      <div className="card-body">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
};

export default SpaceEarn;
