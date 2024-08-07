#!/bin/bash

version_comparison () {
    if [[ "$1" == "$2" ]]
    then
        echo '='
        return
    fi
    local IFS=.
    local i ver1 ver2
    read -r -a ver1 <<< "$1"
    read -r -a ver2 <<< "$2"

    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            echo '>'
            return
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            echo '<'
            return
        fi
    done
    echo '='
    return
}
