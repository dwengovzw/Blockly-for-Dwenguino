#!/bin/bash


has_param() {
    local term="$1"
    shift
    for arg; do
        if [[ $arg == "$term" ]]; then
            return 0
        fi
    done
    return 1
}

if [[ "$1" == '-h' || "$1" == '--help' || "$#" != 3 ]]; then
    echo "Script needs two parameters:"
    echo "1: signature file location (will be created)"
    echo "2: input hex file in intel format (.elf) (should exist)."
    echo  "3: name of the output file. (will be created)"
    exit 0
fi

# Check if .elf file exists
if [[ -f "$2" ]]; then
    echo "$2 exists."
else
    echo "$2 does not exist"
    exit 0
fi

avr-objcopy -O binary "$2" /tmp/output.bin

# First extract information from the binary file.
sectorsizebytes=512
filesizebytes=$(stat -c%s /tmp/output.bin)
numsectors=$((filesizebytes/$sectorsizebytes+1))
echo "Size of $2 in bytes: $filesizebytes which is $numsectors sectors."

# Now generate the signature file and the zero padding for the first sector
printf "%b" '\x74\x08\xcc\x96' > "$1" #sig.bin	# Verification signature
printf "0: %.2x" $numsectors | xxd -r -p >> "$1" #sig.bin	# Number of sectors in file
dd < /dev/zero bs=507 count=1 >> "$1" #sig.bin	# Zero padding to full sector size 512 sector size - 4 signature bytes - 1 filesize byte

# Prepend the signature to the binary file
cat "$1" /tmp/output.bin > "$3"
