#!/usr/bin/perl

# parse_commandpath.pl
# 
# Execute from the root of your scripts directory, where init.js is contained.
#

use File::Find;

use strict;

my (@fileList, @commandPathData);
my ($moduleName, $commandName, $commandSubText, $commandOptions, $commandDesc, $commandSubCommands, $extractString);

sub findWanted { if (/\.js$/s) { push @fileList, $File::Find::name; } } 
find(\&findWanted, ".");

my (@dateData) = localtime();
printf "Bot \@commandpath Parser. Executed on: %02d/%02d/%4d \@ %02d:%02d:%02d \n\n",
        $dateData[3], $dateData[4] + 1, $dateData[5] + 1900, $dateData[2], $dateData[1], $dateData[0];

foreach $moduleName (sort @fileList) {
  
  open(FH, $moduleName) or die "Failed to open file: $moduleName\n";
  
  print "$moduleName\n\n";  
  while (<FH>) {
    if (/\@commandpath/) {
      chomp;
      if (/\@commandpath\s+(\w+)\s+([\w\W]*)\s+\-\s+([\w\W]+)/) { 
        ($commandName, $commandSubText, $commandDesc) = $_ =~ m/[\w\W]+\@commandpath\s+(\w+)\s+([\w\W]+)\s+\-\s+([\w\W]+)/;
      } elsif (/\@commandpath\s+(\w+)\s+-\s+([\w\W]+)/) {
        ($commandName, $commandDesc) = $_ =~ m/\@commandpath\s+(\w+)\s+\-\s+([\w\W]+)/;
        $commandSubText = '';
        $commandOptions = '';
        $commandSubCommands = '';
      }

      if (length($commandSubText) > 0) {
        if ($commandSubText =~ m/\[/) {
          ($commandSubCommands, $commandOptions) = split('\[', $commandSubText, 2);
          if (length($commandOptions) > 0) {
            $commandOptions = "[".$commandOptions;
          }
        } else {
          $commandSubCommands = $commandSubText;
        }
        $commandSubCommands =~ s/\s+$//;
        $commandName = $commandName." ".$commandSubCommands if (length($commandSubCommands) > 0) ;
      }
      
      if (length($commandOptions) > 0) {
        print "!$commandName $commandOptions\n";
      } else {
        print "!$commandName\n";
      }
      print "$commandDesc\n\n";
      
    }
  }
  print "\n";
  close(FH);  
}

printf "\nBot \@commandpath Parser. Executed on: %02d/%02d/%4d \@ %02d:%02d:%02d \n",
        $dateData[3], $dateData[4] + 1, $dateData[5] + 1900, $dateData[2], $dateData[1], $dateData[0];
