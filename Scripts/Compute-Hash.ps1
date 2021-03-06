# Usage example
# ls -Filter "*.mp3" | where {!$_.PsIsContainer} | Compute-Hash | Export-CSV "output.csv" -NoTypeInformation

function Compute-Hash
{
    process
    {
        if ([System.IO.File]::Exists($_.FullName))
        {
            $Hasher = [System.Security.Cryptography.SHA1]::Create()
            $FileStream = ([System.IO.StreamReader]$_.FullName)
            $HashBytes = $Hasher.ComputeHash($FileStream.BaseStream)
            $HashString = [System.BitConverter]::ToString($HashBytes).Replace('-','').ToLower()
            
            $Result = new-object PSObject
            
            $Result | add-member -type NoteProperty -Name Name -Value $_.Name
            $Result | add-member -type NoteProperty -Name Hash -Value $HashString
                        
            Write-Output $Result
        }
    }
}