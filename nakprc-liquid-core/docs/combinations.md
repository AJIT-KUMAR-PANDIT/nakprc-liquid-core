# Combinations

You can combine the classes to get the full effect. The components adapt to the container size.

```jsx
import { LIQUID_GLASS, LIQUID_LENS, LIQUID_IMG, LIQUID_TEXT } from 'nakprc-liquid-core';

export function LiquidCombination() {
  return (
    <div className={`${LIQUID_GLASS} ${LIQUID_LENS} w-full h-full min-h-[320px]`}>
      <img src="photo.jpg" className={LIQUID_IMG} />
      <h1 className={`${LIQUID_TEXT} text-white`}>Liquid Text</h1>
    </div>
  );
}
```
