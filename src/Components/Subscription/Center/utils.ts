export function normalizePath(pathArray : string[], fileName? : string)
{
    if(pathArray[pathArray.length-1] === "/")
    {
        if(fileName)
            return "/"+fileName;
        else
            return "/"
    }
    let path = pathArray.join("/")
    path = path.slice(1)
    if(fileName)
        return path+"/"+fileName
    return path
}