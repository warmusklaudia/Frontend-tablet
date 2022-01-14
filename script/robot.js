

function Animate(){
  let tl = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power1.inOut',
    },
    repeat: -1,
    yoyo: true,
  });
  tl.set('#Shadow', {
    transformOrigin: '50% 100%',
  })
    .fromTo(
      '#Robot',
      {
        y: 2.5,
      },
      {
        y: -2.5,
      }
    )
    .to(
      '#Arm-right',
      {
        y: 0.5,
      },
      {
        y: -0.5,
      }
    )
    .to(
      '#Arm-left',
      {
        y: 0.5,
      },
      {
        y: -0.5,
      }
    )
    .to(
      '#Shadow',
      {
        scale: 0.75,
      },
      '<'
    )
    .to(
      '#Fire',
      {
        scale: 0.92,
      },
      '<'
    );
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM geladen');
  Animate();
});
