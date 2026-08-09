{/* Hukuki Onay Kutucuğu */}
<div className="flex items-start gap-2 my-4 text-xs text-gray-400">
  <input 
    type="checkbox" 
    id="terms-check" 
    required 
    className="mt-0.5 w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
  />
  <label htmlFor="terms-check" className="cursor-pointer select-none leading-tight">
    I agree to the <a href="/terms" target="_blank" className="underline text-white hover:text-emerald-400">Terms of Service</a> and <a href="/privacy" target="_blank" className="underline text-white hover:text-emerald-400">Privacy Policy</a> of <strong>fladnag</strong>.
  </label>
</div>
