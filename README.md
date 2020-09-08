# Introduction 
Convert yaml into Azure ARM parameters templates (json).

# Usage
template/t: template to convert into.

## Node
```
node ./index.js -t ./template.json
```

## NPM
```
  "scripts": {
    "puff": "puff -t default.json"
}
```

# Examples
## Yaml
```
name: example
default:
    key1: value1default
    key2: value2default
environments:
  one:
    key3: value2one
    regions:
    - abc:
        key1: value1abc
  two:
    key4: value4two
    region: xyz
```

## Template (json)
```
{
    "parameters": {}
}
```

## Output (json)
### example.one.abc.json
```
{
 "parameters": {
  "key1": {
   "value": "value1abc"
  },
  "key2": {
   "value": "value2default"
  },
  "key3": {
   "value": "value2one"
  },
  "region": {
   "value": "abc"
  }
 }
}
```
### example.two.xyz.json
```
{
 "parameters": {
  "key1": {
   "value": "value1default"
  },
  "key2": {
   "value": "value2default"
  },
  "key4": {
   "value": "value4two"
  },
  "region": {
   "value": "xyz"
  }
 }
}
```