<select class="combobox">
    <#if(data){
        for(c=0;c<data.length;c++){#>
            <option value="<#=data[c].value#>"><#=data[c].text#></option>
    <#}}#>
</select>