%define product CMFActivity
%define version 0.12
%define release 1

%define zope_home %{_prefix}/lib/zope
%define software_home %{zope_home}/lib/python

Summary:   Activity Tool for Zope
Name:      zope-%{product}
Version:   %{version}
Release:   %mkrel %{release}
License:   GPL
Group:     System/Servers
URL:       http://www.erp5.org
Source0:   %{product}-%{version}.tar.bz2
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-rootdir
BuildArch: noarch
Conflicts: CMFActivity
Requires:  zope zope-CMF zope-TimerService

#----------------------------------------------------------------------
%description
This tools add activities for Zope objects.

#----------------------------------------------------------------------
%prep
%setup -c

%build


%install
%{__rm} -rf %{buildroot}
%{__mkdir_p} %{buildroot}/%{software_home}/Products
%{__cp} -a * %{buildroot}%{software_home}/Products/


%clean
%{__rm} -rf %{buildroot}

%post
if [ "`%{_prefix}/bin/zopectl status`" != "daemon manager not running" ] ; then
  service zope restart
fi

%postun
if [ -f "%{_prefix}/bin/zopectl" ] && [ "`%{_prefix}/bin/zopectl status`" != "daemon manager not running" ] ; then
  service zope restart
fi

%files
%defattr(0644, zope, zope, 0755)
%doc %{product}/VERSION.txt
%{software_home}/Products/*

#----------------------------------------------------------------------
%changelog
* Tue May 02 2006 Kevin Deldycke <kevin@nexedi.com> 0.12-1mdk
- New build from the SVN repository

* Tue Apr 04 2006 Kevin Deldycke <kevin@nexedi.com> 0.11-6mdk
- New build from the SVN repository

* Wed Feb 01 2006 Kevin Deldycke <kevin@nexedi.com> 0.11-5mdk
- Give ownership to zope
- New build from the CVS

* Wed Feb 01 2006 Kevin Deldycke <kevin@nexedi.com> 0.11-4mdk
- Give ownership to zope
- New build from the CVS

* Mon Jan 30 2006 Kevin Deldycke <kevin@nexedi.com> 0.11-3mdk
- New build from the CVS

* Fri Jan 27 2006 Kevin Deldycke <kevin@nexedi.com> 0.11-2mdk
- New build from the CVS

* Thu Jan 26 2006 Kevin Deldycke <kevin@nexedi.com> 0.11-1mdk
- Update to version 0.11

* Mon Jan 23 2006 Kevin Deldycke <kevin@nexedi.com> 0.10-2mdk
- CMFActivity need Timer Service Zope product

* Wed Jan 18 2006 Kevin Deldycke <kevin@nexedi.com> 0.10-1mdk
- Update to version 0.10

* Mon Jan 16 2006 Kevin Deldycke <kevin@nexedi.com> 0.9.20060116-1mdk
- New build from the CVS

* Tue Jan 10 2006 Kevin Deldycke <kevin@nexedi.com> 0.9.20060110-1mdk
- New release for Mandriva 2006
- Spec file updated

* Tue Sep 01 2004 Sebastien Robin <seb@nexedi.com> 0.8-1mdk
- Final relase for Mandrake 10.1

* Mon Jun 14 2004 Sebastien Robin <seb@nexedi.com> 0.1-2mdk
- New release for Mandrake 10.1

* Mon Feb 09 2004 Sebastien Robin <seb@nexedi.com> 0.1-1nxd
- Create the spec file
