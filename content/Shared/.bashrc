[[ -s ~/.bash_aliases ]] && source ~/.bash_aliases
[[ -s ~/.bash_colours ]] && source ~/.bash_colours
[[ -s ~/.bash_paths ]] && source ~/.bash_paths

# # Assign code completion if the file exists
# if [ -e /etc/bash_completion.d ]; then
#     for file in /etc/bash_completion.d/* ; do
#         source "$file"
#     done
# fi