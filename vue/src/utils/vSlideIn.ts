// todo 配置首页照片滑动显示效果 vSlideIn

const DISTANCE = 200;

const DURATION = 300;

const map = new WeakMap();
const ob = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      //出现在视口中
      const aniamtion = map.get(entry.target);
      aniamtion && aniamtion.play();
      ob.unobserve(entry.target)
    }
  }
})

function isBelowViewport(el: any) {
  const rect = el.getBoundingClientRect();
  return rect.top - window.innerHeight > 0;
}

export default {
  mounted(el: any) {
    if (!isBelowViewport(el)) {
      return;

    }
    const animation = el.animate([{
      transform: `translateY(${DISTANCE}px)`,
      opacity: 0.5
    },
    {
      transform: `translateY(0)`,
      opacity: 1
    }], {
      duration: DURATION,
      ease: 'ease-out',
      fill: 'forwards'
    });
    animation.pause();
    map.set(el, animation);
    ob.observe(el);
  },
  unmounted(el: any) {
    ob.unobserve(el)
  },
}