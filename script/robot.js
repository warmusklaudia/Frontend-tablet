function Animate() {
  let tl = gsap.timeline({
    defaults: {
      duration: 0.75,
      ease: 'power2.inOut',
      yoyoEase: 'sine.out',
    },
    repeat: -1,
    yoyo: true,
  });

  tl.set('#Shadow', {
    transformOrigin: '50% 100%',
  })
    .set('#Fire', {
      transformOrigin: '50% 0%',
    })
    .set('#Arm-left', {
      transformOrigin: '100% 0%',
    })
    .set('#Arm-right', {
      transformOrigin: '0% 0%',
    })
    .fromTo(
      '#Robot',
      {
        y: 2.5,
      },
      {
        y: -5,
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
      '#Head',
      {
        y: 1,
        yoyoEase: 'power3.out',
      },
      '<'
    )
    .to(
      '#Arm-left',
      {
        rotate: -3,
        yoyoEase: 'power3.out',
      },
      '<'
    )
    .to(
      '#Arm-right',
      {
        rotate: 3,
        yoyoEase: 'power3.out',
      },
      '<'
    )
    .to(
      '#Fire',
      {
        scale: 1.15,
        ease: 'power3.out',
        yoyoEase: 'power3.out',
      },
      '<'
    );
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM geladen');
  Animate();
});
