<script lang="ts">
  let { code, filename }: { code: string; filename?: string } = $props();
  let copied = $state(false);

  function copyCode() {
    navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="code-block">
  {#if filename}
    <div class="code-header">
      <span class="filename">{filename}</span>
      <button class="copy-btn" onclick={copyCode}>
        {copied ? '✓ Copied' : 'Copy'}
      </button>
    </div>
  {/if}
  <pre><code>{code}</code></pre>
</div>

<style>
  .code-block {
    background: #1e1e2e;
    border-radius: 12px;
    overflow: hidden;
    margin: 1rem 0;
    font-size: 0.9rem;
  }
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: #2a2a3e;
  }
  .filename {
    color: #89b4fa;
    font-family: monospace;
    font-size: 0.85rem;
  }
  .copy-btn {
    background: none;
    border: 1px solid #45475a;
    color: #a6adc8;
    padding: 4px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
  }
  .copy-btn:hover {
    background: #45475a;
    color: white;
  }
  pre {
    padding: 1rem 1.5rem;
    margin: 0;
    overflow-x: auto;
  }
  code {
    color: #cdd6f4;
    font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
    line-height: 1.6;
    white-space: pre;
  }
</style>
