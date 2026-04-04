export const snippets = {
  vanilla: {
    text: `import { tagSphere } from 'tag-sphere';

const el = document.getElementById('my-sphere');
if (!el) throw new Error('Missing #my-sphere');

tagSphere(el, {
  tags: ['Astro', 'TypeScript', 'React'],
  radius: 120,
  speed: 0.01,
  direction: 20,
});`,
    html: `<span class="code-line"><span class="tok-keyword">import</span> { <span class="tok-function">tagSphere</span> } <span class="tok-keyword">from</span> <span class="tok-string">'tag-sphere'</span>;</span>
<span class="code-line"><span class="tok-keyword">const</span> <span class="tok-variable">el</span> = <span class="tok-property">document</span>.<span class="tok-function">getElementById</span>(<span class="tok-string">'my-sphere'</span>);</span>
<span class="code-line"><span class="tok-keyword">if</span> (!<span class="tok-variable">el</span>) <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'Missing #my-sphere'</span>);</span>
<span class="code-line"></span>
<span class="code-line"><span class="tok-function">tagSphere</span>(<span class="tok-variable">el</span>, {</span>
<span class="code-line">  <span class="tok-property">tags</span>: [<span class="tok-string">'Astro'</span>, <span class="tok-string">'TypeScript'</span>, <span class="tok-string">'React'</span>],</span>
<span class="code-line">  <span class="tok-property">radius</span>: <span class="tok-number">120</span>,</span>
<span class="code-line">  <span class="tok-property">speed</span>: <span class="tok-number">0.01</span>,</span>
<span class="code-line">  <span class="tok-property">direction</span>: <span class="tok-number">20</span>,</span>
<span class="code-line">});</span>`,
  },
  react: {
    text: `import { TagSphere } from 'tag-sphere/react';

export function Example() {
  return (
    <TagSphere
      tags={['Astro', 'TypeScript', 'React']}
      radius={120}
      speed={0.01}
      direction={20}
      style={{ width: 320, height: 320, position: 'relative' }}
    />
  );
}`,
    html: `<span class="code-line"><span class="tok-keyword">import</span> { <span class="tok-tag">TagSphere</span> } <span class="tok-keyword">from</span> <span class="tok-string">'tag-sphere/react'</span>;</span>
<span class="code-line"></span>
<span class="code-line"><span class="tok-keyword">export</span> <span class="tok-keyword">function</span> <span class="tok-function">Example</span>() {</span>
<span class="code-line">  <span class="tok-keyword">return</span> (</span>
<span class="code-line">    &lt;<span class="tok-tag">TagSphere</span></span>
<span class="code-line">      <span class="tok-property">tags</span>={[<span class="tok-string">'Astro'</span>, <span class="tok-string">'TypeScript'</span>, <span class="tok-string">'React'</span>]}</span>
<span class="code-line">      <span class="tok-property">radius</span>={<span class="tok-number">120</span>}</span>
<span class="code-line">      <span class="tok-property">speed</span>={<span class="tok-number">0.01</span>}</span>
<span class="code-line">      <span class="tok-property">direction</span>={<span class="tok-number">20</span>}</span>
<span class="code-line">      <span class="tok-property">style</span>={{ <span class="tok-property">width</span>: <span class="tok-number">320</span>, <span class="tok-property">height</span>: <span class="tok-number">320</span>, <span class="tok-property">position</span>: <span class="tok-string">'relative'</span> }}</span>
<span class="code-line">    /&gt;</span>
<span class="code-line">  );</span>
<span class="code-line">}</span>`,
  },
  astro: {
    text: `---
import 'tag-sphere/styles';
---

<div id="my-sphere" style="position:relative;width:320px;aspect-ratio:1"></div>

<script type="module">
  import { tagSphere } from 'tag-sphere';

  const el = document.getElementById('my-sphere');
  if (!el) throw new Error('Missing #my-sphere');

  tagSphere(el, {
    tags: ['Astro', 'TypeScript', 'Vite'],
    radius: 120,
    speed: 0.01,
    direction: 20,
  });
</script>`,
    html: `<span class="code-line">---</span>
<span class="code-line"><span class="tok-keyword">import</span> <span class="tok-string">'tag-sphere/styles'</span>;</span>
<span class="code-line">---</span>
<span class="code-line"></span>
<span class="code-line">&lt;<span class="tok-tag">div</span> <span class="tok-property">id</span>=<span class="tok-string">"my-sphere"</span> <span class="tok-property">style</span>=<span class="tok-string">"position:relative;width:320px;aspect-ratio:1"</span>&gt;&lt;/<span class="tok-tag">div</span>&gt;</span>
<span class="code-line"></span>
<span class="code-line">&lt;<span class="tok-tag">script</span> <span class="tok-property">type</span>=<span class="tok-string">"module"</span>&gt;</span>
<span class="code-line">  <span class="tok-keyword">import</span> { <span class="tok-function">tagSphere</span> } <span class="tok-keyword">from</span> <span class="tok-string">'tag-sphere'</span>;</span>
<span class="code-line"></span>
<span class="code-line">  <span class="tok-keyword">const</span> <span class="tok-variable">el</span> = <span class="tok-property">document</span>.<span class="tok-function">getElementById</span>(<span class="tok-string">'my-sphere'</span>);</span>
<span class="code-line">  <span class="tok-keyword">if</span> (!<span class="tok-variable">el</span>) <span class="tok-keyword">throw</span> <span class="tok-keyword">new</span> <span class="tok-function">Error</span>(<span class="tok-string">'Missing #my-sphere'</span>);</span>
<span class="code-line"></span>
<span class="code-line">  <span class="tok-function">tagSphere</span>(<span class="tok-variable">el</span>, {</span>
<span class="code-line">    <span class="tok-property">tags</span>: [<span class="tok-string">'Astro'</span>, <span class="tok-string">'TypeScript'</span>, <span class="tok-string">'Vite'</span>],</span>
<span class="code-line">    <span class="tok-property">radius</span>: <span class="tok-number">120</span>,</span>
<span class="code-line">    <span class="tok-property">speed</span>: <span class="tok-number">0.01</span>,</span>
<span class="code-line">    <span class="tok-property">direction</span>: <span class="tok-number">20</span>,</span>
<span class="code-line">  });</span>
<span class="code-line">&lt;/<span class="tok-tag">script</span>&gt;</span>`,
  },
};
