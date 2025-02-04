{-# LANGUAGE ForeignFunctionInterface #-}
{-# LANGUAGE OverloadedStrings #-}

module OfmcFFI where

-- Import your modules that contain the logic
import AnBmain (newanbmain) -- adjust as necessary
-- import other modules as needed
import Control.Exception (SomeException, catch)
import Foreign.C.String (CString, newCString, peekCString)
import System.IO

-- | This is the core processing function.
-- It’s a simplified version that takes a file’s contents as input and returns the result.
processInput :: String -> IO String
processInput input = do
  -- Here you may want to parse some options.
  -- For example, you might always call newanbmain (if using an AnB file)
  -- or otherwise call functions from mainWithArgs.
  --
  -- For this example, we simply call newanbmain with default options.
  let defaultAnBOptsAndPars =
        -- provide default options. Modify as needed.
        -- In the original main file you build options using parseArgs.
        undefined
  -- Replace undefined above with your default options, or create a variant
  -- that does not depend on command-line arguments.
  --
  -- If your code is structured so that you can call a function that accepts
  -- a String (the file contents) and produces output then call that:
  output <- return (newanbmain input defaultAnBOptsAndPars)
  return output

-- | Exposed FFI function.
-- The function accepts an input CString (e.g. the file contents)
-- and returns the result CString of our analysis (or compilation).
foreign export ccall runOfmc :: CString -> IO CString

runOfmc :: CString -> IO CString
runOfmc cstr = do
  input <- peekCString cstr
  result <-
    processInput input `catch` \(e :: SomeException) ->
      return ("Error occurred: " ++ show e)
  newCString result
