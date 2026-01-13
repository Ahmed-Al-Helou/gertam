@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://alfaraaonline.com.sa/wp-content/uploads/2021/04/logo-2.jpg" class="logo" alt="Laravel Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
