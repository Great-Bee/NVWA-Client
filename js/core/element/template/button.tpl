<button type="button" class="btn btn-default 
      <#= attributes.size ? 'btn-'+attributes.size : ''#>
  ">
  <span class="glyphicon 
    <#= attributes.glyphicon ? '' : ' hidden'#>
    <#= attributes.glyphicon ? 'glyphicon-'+attributes.glyphicon : ''#>
    ">
  </span>&nbsp;<b><#=attributes.text#></b>
</button>