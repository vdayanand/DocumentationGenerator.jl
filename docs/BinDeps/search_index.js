var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Readme",
    "title": "Readme",
    "category": "page",
    "text": ""
},

{
    "location": "#BinDeps.jl-1",
    "page": "Readme",
    "title": "BinDeps.jl",
    "category": "section",
    "text": "(Image: BinDeps) (Image: Travis) (Image: AppVeyor)Easily build binary dependencies for Julia packages"
},

{
    "location": "#FAQ-1",
    "page": "Readme",
    "title": "FAQ",
    "category": "section",
    "text": "Since there seems to be a lot of confusion surrounding the package systems and the role of this package, before we get started looking at the actual package, I want to answer a few common questions:What is BinDeps?\nBinDeps is a package that provides a collection of tools to build binary dependencies for Julia packages.\nDo I need to use this package if I want to build binary dependencies for my Julia package?\nAbsolutely not! The system is designed to give the maximum amount of freedom to the package author in order to be able to address any situation that one may encounter in the real world. This is achieved by simply evaluating a file called deps/build.jl (if it exists) in a package whenever it is installed or updated. Thus the following might perhaps be the simplest possible useful build.jl script one can imagine:run(`make`)I want to use BinDeps, but it is missing some functionality I need (e.g. a package manager)\nSince BinDeps is written in Julia it is extensible with the same ease as the rest of Julia. In particular, defining new behavior, e.g. for adding a new package manager, consists of little more than adding a type and implementing a couple of methods (see the section on Interfaces) or the WinRPM package for an example implementation.\nI like the runtime features that BinDeps provides, but I don\'t really want to use its build time capabilities. What do you recommend?\nThe easiest way to do this is probably just to declare a BuildProcess for all your declared dependencies. This way, your custom build process will be called whenever there is an unsatisfied library dependency and you may still use the BinDeps runtime features.\nIs there anything I should keep in mind when extending BinDeps or writing my own build process?\nBinDeps uses a fairly standard set of directories by default and if possible, using the same directory structure is advised. Currently the specified directory structure is:deps/\n    build.jl        # This is your build file\n    downloads/      # Store any binary/source downloads here\n    builds/\n        dep1/       # out-of-tree build for dep1, is possible\n        dep2/       # out-of-tree build for dep2, is possible\n        ...\n    src/\n        dep1/       # Source code for dep1\n        dep2/       # Source code for dep2\n        ...\n    usr/            # \"prefix\", install your binaries here\n        lib/        # Dynamic libraries (yes even on Windows)\n        bin/        # Excecutables\n        include/    # Headers\n        ..."
},

{
    "location": "#The-high-level-interface-Declaring-dependencies-1",
    "page": "Readme",
    "title": "The high level interface - Declaring dependencies",
    "category": "section",
    "text": "To get a feel for the high level interface provided by BinDeps, have a look at real-world examples. The build script from the GSL pakage illustrates the simple case where only one library is needed. On the other hand, the build script from the Cairo package uses almost all the features that BinDeps currently provides and offers a complete overview. Let\'s take it apart, to see exactly what\'s going on.As you can see Cairo depends on a lot of libraries that all need to be managed by this build script. Every one of these library dependencies is introduced by the library_dependency function. The only required argument is the name of the library, so the following would be an entirely valid call:foo = library_dependency(\"libfoo\")However, you\'ll most likely quickly run into the issue that this library is named differently on different systems, which is why BinDeps provides the handy aliases keyword argument. So suppose our library is sometimes known as libfoo.so, but other times as libfoo-1.so or libfoo-1.0.0.dylib or even libbar.dll on windows, because the authors of the library decided to punish windows users. In either case, we can easily declare all these in our library dependency:foo = library_dependency(\"libfoo\", aliases = [\"libfoo\", \"libfoo-1\", \"libfoo-1.0.0\", \"libbar\"])So far so good! There are a couple of other keyword arguments that are currently implemented:os = OS_NAME  Limits this dependency to certain operating systems. The same could be achieved by using the OS-specific macro, but  this setting applies to all uses of this dependency and avoids having to wrap all uses of this dependency in macros.  Note that the os parameter must match the value of Base.OS_NAME on the target platform with the special exception that  :Unix matches all Unix-like platforms (e.g. Linux, Mac OS X, FreeBSD)  As an example, consider this line from the Cairo build script:gettext = library_dependency(\"gettext\", aliases = [\"libgettext\", \"libgettextlib\"], os = :Unix)depends = [dep1, dep2]  Currently unused, but in the future will be used to keep track of the dependency graph between binary dependencies to allow parallel builds. E.g.:cairo = library_dependency(\"cairo\", aliases = [\"libcairo-2\", \"libcairo\"], depends = [gobject, fontconfig, libpng])runtime::Bool  Whether or not to consider this a runtime dependency. If false, its absence  will not trigger an error at runtime (and it will not be loaded), but if it  cannot be found at buildtime it will be installed. This is useful for build-time  dependencies of other binary dependencies.\nvalidate::Function  You may pass a function to validate whether or not a certain library is usable,  e.g. whether or not has the correct version. To do so, pass a function that takes  (name,handle) as an argument and returns true if the library is usable and false  it not. The name argument is either an absolute path or the library name if it is a  global system library, while the handle is a handle that may be passed to dlsym to  check library symbols or the return value of a function.  Should the validation return false for a library that was installed by a provider, the  provider will be instructed to force a rebuild.function validate_cairo_version(name,handle)\n    f = Libdl.dlsym_e(handle, \"cairo_version\")\n    f == C_NULL && return false\n    v = ccall(f, Int32,())\n    return v > 10800\nend\n...\ncairo = library_dependency(\"cairo\", aliases = [\"libcairo-2\", \"libcairo\"], validate = validate_cairo_version)Other keyword arguments will most likely be added as necessary."
},

{
    "location": "#The-high-level-interface-Declaring-build-mechanisms-1",
    "page": "Readme",
    "title": "The high level interface - Declaring build mechanisms",
    "category": "section",
    "text": "Alright, now that we have declared all the dependencies that we need let\'s tell BinDeps how to build them. One of the easiest ways to do so is to use the system package manager. So suppose we have defined the following dependencies:foo = library_dependency(\"libfoo\")\nbaz = library_dependency(\"libbaz\")Let\'s suppose that these libraries are available in the libfoo-dev and libbaz-dev in apt-get and that both libraries are installed by the baz or the baz1 yum package, and the baz pacman package. We may declare this as follows:provides(AptGet, Dict(\"libfoo-dev\" => foo, \"libbaz-dev\" => baz))\nprovides(Yum, [\"baz\", \"baz1\"], [foo, baz])\nprovides(Pacman, \"baz\", [foo, baz])One may remember the provides function by thinking AptGet provides the dependencies foo and baz.The basic signature of the provides function isprovides(Provider, data, dependency, options...)where data is provider-specific (e.g. a string in all of the package manager cases) and dependency is the return value from library_dependency. As you saw above multiple definitions may be combined into one function call as such:provides(Provider, Dict(data1=>dep1, data2=>dep2), options...)which is equivalent to (and in fact will be internally dispatched) to:provides(Provider, data1, dep1, options...)\nprovides(Provider, data2, dep2, options...)If one provide satisfied multiple dependencies simultaneously, dependency may also be an array of dependencies (as in the Yum and Pacman cases above).There are also several builtin options. Some of them are:os = OS_NAME # e.g. :Linux, :Windows, :Darwin\nThis provider can only satisfy the library dependency on the specified os.  This argument takes has the same syntax as the os keyword argument to  library_dependency.\ninstalled_libpath = \"path\"\nIf the provider installs a library dependency to someplace other than the  standard search paths, that location can be specified here.\nSHA = \"sha\"Provides a SHA-256 checksum to validate a downloaded source or binary file against."
},

{
    "location": "#The-high-level-interface-built-in-providers-1",
    "page": "Readme",
    "title": "The high level interface - built in providers",
    "category": "section",
    "text": "We have already seen the AptGet and Yum providers, which all take a string naming the package as their data argument. The other build-in providers are:Sources\nTakes a URI object as its data argument and declared that the sources may be  downloaded from the provided URI. This dependency is special, because it\'s  success does not automatically mark the build as succeeded (in BinDeps  terminology, it\'s a \"helper\"). By default this provider expects the unpacked  directory name to be that of the archive downloaded. If that is not the case,  you may use the :unpacked_dir option to specify the name of the unpacked directory,  e.g.provides(Sources,URI(\"http://libvirt.org/sources/libvirt-1.1.1-rc2.tar.gz\"), libvirt,\n    unpacked_dir = \"libvirt-1.1.1\")Binaries\nIf given a URI object as its data argument, indicates that the binaries may be  downloaded from the provided URI. It is assumed that the binaries unpack the  libraries into usrlib. If given a String as its data argument, provides  a custom search path for the binaries. A typical use might be to allow the  user to provide a custom path by using an environmental variable.\nBuildProcess\nCommon super class of various kind of build processes. The exact behavior depends on the data argument. Some of the currently supported build processes are Autotools and SimpleBuild:\nAutotools\nA subclass of BuildProcess that that downloads the sources (as declared by the  \"Sources\" provider) and attempts to  install using Autotools. There is a plethora of options to  change the behavior of  this command. See the appropriate section of the manual (or even better,  read the code) for more details on the available options.Autotools(; options...)SimpleBuild\nA subclass of BuildProcess that takes any object that\'s part of the low-level interface and could be passed to run and simply executes that command."
},

{
    "location": "#The-high-level-interface-Loading-dependencies-1",
    "page": "Readme",
    "title": "The high level interface - Loading dependencies",
    "category": "section",
    "text": "To load dependencies without a runtime dependence on BinDeps, place code like the following near the start of the Package\'s primary file. Don\'t forget to change the error message to reflect the name of the package.const depsfile = joinpath(dirname(@__FILE__), \"..\", \"deps\", \"deps.jl\")\nif isfile(depsfile)\n    include(depsfile)\nelse\n    error(\"HDF5 not properly installed. Please run Pkg.build(\\\"HDF5\\\") then restart Julia.\")\nendThis will make all your libraries available as variables named by the names you gave the dependency. E.g. if you declared a dependency aslibrary_dependency(\"libfoo\")The libfoo variable will now contain a reference to that library that may be passed to ccall or similar functions."
},

{
    "location": "#The-low-level-interface-1",
    "page": "Readme",
    "title": "The low level interface",
    "category": "section",
    "text": "The low level interface provides a number of utilities to write cross platform    build scripts. It looks something like this (from the Cairo build script):@build_steps begin\n    GetSources(libpng)\n    CreateDirectory(pngbuilddir)\n    @build_steps begin\n        ChangeDirectory(pngbuilddir)\n        FileRule(joinpath(prefix,\"lib\",\"libpng15.dll\"),@build_steps begin\n            `cmake -DCMAKE_INSTALL_PREFIX=\"$prefix\" -G\"MSYS Makefiles\" $pngsrcdir`\n            `make`\n            `cp libpng*.dll $prefix/lib`\n            `cp libpng*.a $prefix/lib`\n            `cp libpng*.pc $prefix/lib/pkgconfig`\n            `cp pnglibconf.h $prefix/include`\n            `cp $pngsrcdir/png.h $prefix/include`\n            `cp $pngsrcdir/pngconf.h $prefix/include`\n        end)\n    end\nendAll the steps are executed synchronously. The result of the @build_steps macro may be passed to run to execute it directly, thought this is not recommended other than for debugging purposes. Instead, please use the high level interface to tie the build process to dependencies.Some of the builtin build steps are:FileDownloader(remotefile,localfile)\nDownload a file from remote_file create it as local_file\nFileUnpacker(local_file,folder)\nUnpack the file `local_file` into the folder `folder`\nAutotoolsDependency(opts...)\nInvoke autotools. Use of this build step is not recommended. Use the high level interface instead\nCreateDirectory(dir)\nCreate the directory dir\nChangeDirectory(dir)\ncd into the directory dir and try to remain there for this build block. Must be the first command in a @build_steps block and will remain active for the entire block\nMakeTargets([dir,],[args...],env)\nInvoke make with the given arguments in the given directory with the given environment.\nDirectoryRule(dir,step)\nIf dir does not exist invoke step and validate that the directory was created\nFileRule([files...],step)\nLike Directory rule, but validates the existence of any of the files in the filesarray`.\nGetSources(dep)\nGet the declared sources from the dependency dep and put them in the default download location"
},

{
    "location": "#Diagnostics-1",
    "page": "Readme",
    "title": "Diagnostics",
    "category": "section",
    "text": "A simple way to see what libraries are required by a package, and to detect missing dependencies, is to use BinDeps.debug(\"PackageName\"):julia> using BinDeps\n\njulia> BinDeps.debug(\"Cairo\")\nINFO: Reading build script...\nThe package declares 1 dependencies.\n - Library Group \"cairo\" (satisfied by BinDeps.SystemPaths, BinDeps.SystemPaths)\n     - Library \"png\" (not applicable to this system)\n     - Library \"pixman\" (not applicable to this system)\n     - Library \"ffi\" (not applicable to this system)\n     - Library \"gettext\"\n        - Satisfied by:\n          - System Paths at /usr/lib64/preloadable_libintl.so\n          - System Paths at /usr/lib64/libgettextpo.so\n        - Providers:\n          - BinDeps.AptGet package gettext (can\'t provide)\n          - BinDeps.Yum package gettext-libs (can\'t provide)\n          - Autotools Build"
},

{
    "location": "autodocs/#BinDeps.glibc_version-Tuple{}",
    "page": "Docstrings",
    "title": "BinDeps.glibc_version",
    "category": "method",
    "text": "glibc_version()\n\nFor Linux-based systems, return the version of glibc in use. For non-glibc Linux and other platforms, returns nothing.\n\n\n\n\n\n"
},

{
    "location": "autodocs/#",
    "page": "Docstrings",
    "title": "Docstrings",
    "category": "page",
    "text": "Package doesn\'t contain Documenter docs.Docs automatically generated by juliadocs.orgModules = [BinDeps]\nOrder = [:type, :function]"
},

]}
